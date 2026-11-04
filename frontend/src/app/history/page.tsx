"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { History, Loader2, Search, AlertCircle, Trash2, ArrowRight } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";

interface SearchHistoryItem {
  search_id: number;
  query: string;
  timestamp: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/history");
        if (!res.ok) {
          throw new Error("Failed to load search history");
        }
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const handleRemove = async (search_id: number) => {
    try {
      const res = await fetch(`/api/history?search_id=${search_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.search_id !== search_id));
      } else {
        console.error("Failed to delete history item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire search history?")) return;
    
    setIsClearing(true);
    try {
      const res = await fetch(`/api/history?clear_all=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory([]);
      } else {
        setError("Failed to clear history");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to clear history");
    } finally {
      setIsClearing(false);
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-jakarta text-foreground tracking-tight">Search History</h1>
            <p className="text-muted-foreground font-medium mt-1">
              Your recent queries
            </p>
          </div>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={handleClearAll}
            disabled={isClearing}
            className="text-destructive border border-destructive/30 bg-destructive/10 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} 
            Clear History
          </button>
        )}
      </div>

      <div className="h-px w-full bg-border/40"></div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 w-full">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* History List */}
      <div className="flex flex-col gap-3">
        {history.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={item.search_id} 
            className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/60 hover:border-primary/50 hover:shadow-[0_0_15px_hsla(var(--primary),0.1)] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-lg">{item.query}</span>
                <span className="text-xs text-muted-foreground font-medium">{formatTimestamp(item.timestamp)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/search?q=${encodeURIComponent(item.query)}`}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Search Again <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleRemove(item.search_id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Delete from history"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && history.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-background/50 border border-dashed border-border/60 rounded-3xl">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-jakarta text-foreground mb-3">No search history</h2>
          <p className="text-muted-foreground max-w-sm mb-8 text-lg">
            You haven't searched for any products yet.
          </p>
          <Link 
            href="/search"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Start a Search
          </Link>
        </div>
      )}
    </div>
  );
}
