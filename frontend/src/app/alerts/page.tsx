"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Bell, Loader2, AlertCircle, Trash2, Plus, BellOff, BellRing } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";

interface PriceAlert {
  alert_id: number;
  product_name: string;
  target_price: number;
  user_email: string;
  is_active: boolean;
  timestamp: string;
}

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New alert form state
  const [isAdding, setIsAdding] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newTargetPrice, setNewTargetPrice] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      
      if (session.user.email && !newEmail) {
        setNewEmail(session.user.email);
      }

      try {
        const res = await fetch("/api/alerts");
        if (!res.ok) {
          throw new Error("Failed to load price alerts");
        }
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [router]);

  const handleToggleActive = async (alert_id: number, current_status: boolean) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id, is_active: !current_status }),
      });
      if (res.ok) {
        setAlerts((prev) => 
          prev.map((a) => a.alert_id === alert_id ? { ...a, is_active: !current_status } : a)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (alert_id: number) => {
    try {
      const res = await fetch(`/api/alerts?alert_id=${alert_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.alert_id !== alert_id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: newProductName,
          target_price: parseFloat(newTargetPrice),
          user_email: newEmail,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create alert");
      }

      const { alert } = await res.json();
      setAlerts([alert, ...alerts]);
      setIsAdding(false);
      setNewProductName("");
      setNewTargetPrice("");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full max-w-screen-2xl mx-auto p-6 pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen pt-28 px-6 pb-12 flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-[0_0_20px_hsla(var(--primary),0.15)]">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-jakarta text-foreground tracking-tight">Price Alerts</h1>
            <p className="text-muted-foreground font-medium mt-1">
              We'll notify you when prices drop below your target.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> {isAdding ? "Cancel" : "Create Alert"}
        </button>
      </div>

      <div className="h-px w-full bg-border/40"></div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 w-full">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Add Alert Form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          className="bg-background/50 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 shadow-xl overflow-hidden"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" /> New Price Alert
          </h3>
          <form onSubmit={handleAddAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Product Name or URL</label>
              <input 
                type="text" 
                required 
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5"
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Target Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required 
                value={newTargetPrice}
                onChange={(e) => setNewTargetPrice(e.target.value)}
                placeholder="299.99"
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] bg-primary text-primary-foreground rounded-xl font-bold hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Alert"}
            </button>
          </form>
        </motion.div>
      )}

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={alert.alert_id} 
            className={`flex flex-col p-5 rounded-2xl border transition-all ${
              alert.is_active 
                ? "bg-background/60 border-border/60 hover:border-primary/40 shadow-sm" 
                : "bg-muted/30 border-dashed border-border/40 opacity-70"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-lg text-foreground line-clamp-1" title={alert.product_name}>
                  {alert.product_name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Created {formatTimestamp(alert.timestamp)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(alert.alert_id, alert.is_active)}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                    alert.is_active 
                      ? "text-primary hover:bg-primary/10 bg-primary/5" 
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  title={alert.is_active ? "Pause Alert" : "Activate Alert"}
                >
                  {alert.is_active ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleRemove(alert.alert_id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Price</span>
                <span className="text-xl font-bold text-foreground font-jakarta">${alert.target_price.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Notifying</span>
                <span className="text-sm font-medium text-foreground truncate max-w-[150px]">{alert.user_email}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && alerts.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-background/50 border border-dashed border-border/60 rounded-3xl">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
            <BellOff className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-jakarta text-foreground mb-3">No active alerts</h2>
          <p className="text-muted-foreground max-w-sm mb-8 text-lg">
            Create an alert for a product and we'll email you as soon as the price drops.
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Create Your First Alert
          </button>
        </div>
      )}
    </div>
  );
}
