"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOCKOUT_KEY = "login_lockout_time";
const ATTEMPTS_KEY = "login_attempts";
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0", 10);
    const storedLockout = parseInt(localStorage.getItem(LOCKOUT_KEY) || "0", 10);
    
    if (storedLockout && storedLockout > Date.now()) {
      setLockedUntil(storedLockout);
      setAttempts(MAX_ATTEMPTS);
    } else {
      if (storedLockout) {
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.setItem(ATTEMPTS_KEY, "0");
      } else {
        setAttempts(storedAttempts);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil && lockedUntil > Date.now()) {
      setError("Too many login attempts. Please try again after 5 minutes.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_KEY);
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/search");
          router.refresh();
        }, 1500);
      }
    } catch (err: unknown) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem(ATTEMPTS_KEY, newAttempts.toString());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockedUntil(lockoutTime);
        localStorage.setItem(LOCKOUT_KEY, lockoutTime.toString());
        setError("Too many login attempts. Please try again after 5 minutes.");
      } else {
        setError(`Incorrect email or password. Attempt ${newAttempts} of ${MAX_ATTEMPTS}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = lockedUntil !== null && lockedUntil > Date.now();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-24 pb-12">
      <div className="w-full max-w-5xl bg-background/50 backdrop-blur-3xl border border-border/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Graphic / Branding */}
        <div className="relative hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-primary/20 via-primary/5 to-background overflow-hidden border-r border-border/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-[0_0_20px_hsla(var(--primary),0.5)] group-hover:scale-110 transition-transform">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">PredictKaro</span>
            </Link>
          </div>

          <div className="relative z-10 mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-jakarta text-foreground mb-4">
                Welcome back to smarter shopping.
              </h2>
              <p className="text-muted-foreground text-lg max-w-sm">
                Log in to access your price history, saved deals, and personalized alerts across top retailers.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold font-jakarta text-foreground mb-2">Log in</h1>
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold">{error}</p>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-3 shadow-lg"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <p className="text-lg font-bold">Login Successful</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSuccess && (
              <form onSubmit={handleLogin} className="space-y-5">
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
                      disabled={isLocked || isLoading}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center pl-1 pr-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLocked || isLoading}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm text-foreground disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLocked || isLoading}
                      className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLocked || isLoading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-70 disabled:pointer-events-none mt-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
