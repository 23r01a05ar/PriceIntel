"use client";

import Link from "next/link";
import { User, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<unknown>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push("/#features");
    }
  };

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold font-jakarta tracking-tight text-foreground">
            PredictKaro
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className="text-primary font-bold text-xs tracking-wider transition-all duration-200 active:scale-95"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold text-xs tracking-wider cursor-pointer"
            >
              Search
            </Link>
            <a
              href="/#features"
              onClick={handleFeaturesClick}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold text-xs tracking-wider cursor-pointer"
            >
              Features
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/wishlist" className="p-2 text-muted-foreground hover:text-primary transition-colors relative group">
            <Heart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">0</span>
          </Link>
          <Link href="/profile" className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          
          <div className="w-px h-6 bg-border/60 mx-2"></div>

          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted text-sm font-semibold transition-colors">
                <User className="w-4 h-4" />
                <span>Account</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-background/95 backdrop-blur-3xl border-b border-border shadow-xl py-6 px-6 flex flex-col gap-4 max-h-[calc(100vh-72px)] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-primary tracking-wider"
          >
            Home
          </Link>
          <Link
            href="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Search
          </Link>
          <a
            href="/#features"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              handleFeaturesClick(e);
            }}
            className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </a>

          <div className="mt-8 flex flex-col gap-4 border-t border-border/40 pt-6">
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-foreground/80">
              <Heart className="w-5 h-5" /> Saved Deals
            </Link>
            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-foreground/80">
              <Settings className="w-5 h-5" /> Profile
            </Link>
            <div className="flex items-center gap-3 text-lg font-semibold text-foreground/80">
              <ThemeToggle /> Theme
            </div>
            
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-foreground/80 mt-2">
                  <User className="w-5 h-5" /> My Account
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-lg font-semibold text-destructive mt-2 w-full text-left"
                >
                  <LogOut className="w-5 h-5" /> Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl border border-border/60 font-semibold text-foreground hover:bg-muted transition-colors">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-primary text-primary-foreground font-semibold shadow-md active:scale-95 transition-transform">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
