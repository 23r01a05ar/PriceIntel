"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Loader2, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (authError) throw authError;

      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-background/50 backdrop-blur-3xl border border-border/40 rounded-3xl shadow-2xl p-12 text-center flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold font-jakarta text-foreground mb-4">Check your email</h2>
          <p className="text-muted-foreground mb-8">
            We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
          </p>
          <Link 
            href="/login"
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
          >
            Return to Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24 pb-12">
      <div className="w-full max-w-md bg-background/50 backdrop-blur-3xl border border-border/40 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow-[0_0_15px_hsla(var(--primary),0.5)] group-hover:scale-110 transition-transform">
                P
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">PredictKaro</span>
            </Link>
            
            <h1 className="text-3xl font-bold font-jakarta text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-70 disabled:pointer-events-none mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Reset Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
