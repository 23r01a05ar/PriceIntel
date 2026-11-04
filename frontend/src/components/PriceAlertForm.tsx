"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";

export function PriceAlertForm({ productName }: { productName: string }) {
  const [targetPrice, setTargetPrice] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!targetPrice || !userEmail) return;
    setIsSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: productName,
          target_price: parseFloat(targetPrice),
          user_email: userEmail,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-5 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Set Price Alert</h4>
          <p className="text-xs text-muted-foreground">
            {status === "success" ? (
              <span className="text-emerald-500 font-bold">Alert saved successfully!</span>
            ) : status === "error" ? (
              <span className="text-red-500 font-bold">Failed to save alert. Ensure you are logged in.</span>
            ) : (
              "Get notified when the price drops"
            )}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <input 
          type="email" 
          placeholder="Email address" 
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-lg bg-background border border-border text-sm font-medium focus:ring-1 focus:ring-primary outline-none" 
        />
        <div className="relative w-full sm:w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
          <input 
            type="number" 
            placeholder="Target" 
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded-lg bg-background border border-border text-sm font-bold focus:ring-1 focus:ring-primary outline-none" 
          />
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || status === "success"}
          className="w-full sm:w-auto px-4 py-2 bg-foreground text-background font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
