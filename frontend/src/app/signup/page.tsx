"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, User, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Show success screen for email verification
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create account");
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
            We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Please verify your email address to complete your registration.
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
      <div className="w-full max-w-5xl bg-background/50 backdrop-blur-3xl border border-border/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[600px]">
        
        {/* Right Side (visually right, but flex-row-reverse puts it left in HTML for layout): Graphic / Branding */}
        <div className="relative hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-bl from-secondary/20 via-primary/5 to-background overflow-hidden border-l border-border/40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 flex justify-end">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-xl tracking-tight text-foreground">PredictKaro</span>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-[0_0_20px_hsla(var(--primary),0.5)] group-hover:scale-110 transition-transform">
                P
              </div>
            </Link>
          </div>

          <div className="relative z-10 mt-auto text-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-jakarta text-foreground mb-4">
                Join the ultimate pricing platform.
              </h2>
              <p className="text-muted-foreground text-lg ml-auto max-w-sm">
                Create an account to track unlimited products and unlock predictive pricing alerts.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold font-jakarta text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Log in
                </Link>
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

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground"
                  />
                </div>
              </div>

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
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground pl-1 mt-1">Must be at least 6 characters.</p>
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
                    Create account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
