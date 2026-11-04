"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Bell, Heart, History, Settings, Loader2, ArrowRight, Activity, LogOut } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  alertsCount: number;
  wishlistCount: number;
  historyCount: number;
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    alertsCount: 0,
    wishlistCount: 0,
    historyCount: 0,
    username: "User",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        // Fetch all data in parallel to populate the dashboard summary
        const [profileRes, alertsRes, wishlistRes, historyRes] = await Promise.allSettled([
          fetch("/api/profile"),
          fetch("/api/alerts"),
          fetch("/api/wishlist"),
          fetch("/api/history")
        ]);

        let username = session.user.email?.split('@')[0] || "User";
        let alertsCount = 0;
        let wishlistCount = 0;
        let historyCount = 0;

        if (profileRes.status === "fulfilled" && profileRes.value.ok) {
          const profileData = await profileRes.value.json();
          if (profileData.profile?.username) username = profileData.profile.username;
        }

        if (alertsRes.status === "fulfilled" && alertsRes.value.ok) {
          const data = await alertsRes.value.json();
          alertsCount = data.alerts?.length || 0;
        }

        if (wishlistRes.status === "fulfilled" && wishlistRes.value.ok) {
          const data = await wishlistRes.value.json();
          wishlistCount = data.wishlist?.length || 0;
        }

        if (historyRes.status === "fulfilled" && historyRes.value.ok) {
          const data = await historyRes.value.json();
          historyCount = data.history?.length || 0;
        }

        setStats({ username, alertsCount, wishlistCount, historyCount });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full max-w-screen-2xl mx-auto p-6 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const navCards = [
    {
      title: "Price Alerts",
      description: "Manage your active notifications.",
      icon: <Bell className="w-8 h-8" />,
      href: "/alerts",
      count: stats.alertsCount,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50"
    },
    {
      title: "Saved Deals",
      description: "View items in your wishlist.",
      icon: <Heart className="w-8 h-8" />,
      href: "/wishlist",
      count: stats.wishlistCount,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "hover:border-pink-500/50"
    },
    {
      title: "Search History",
      description: "Review your recent product queries.",
      icon: <History className="w-8 h-8" />,
      href: "/history",
      count: stats.historyCount,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/50"
    },
    {
      title: "Profile Settings",
      description: "Update your personal information.",
      icon: <Settings className="w-8 h-8" />,
      href: "/profile",
      count: null,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/50"
    }
  ];

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen pt-28 px-6 pb-12 flex flex-col gap-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold font-jakarta text-foreground tracking-tight mb-2">
              Welcome back, <span className="text-primary">{stats.username}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's a summary of your activity across PredictKaro.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-destructive/10 text-destructive font-semibold rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95 border border-destructive/20"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navCards.map((card, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={card.title}
          >
            <Link 
              href={card.href}
              className={`flex flex-col h-full p-8 rounded-3xl bg-background/50 backdrop-blur-md border border-border/60 ${card.border} transition-all hover:shadow-[0_0_20px_hsla(var(--primary),0.05)] hover:-translate-y-1 group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shadow-inner`}>
                  {card.icon}
                </div>
                {card.count !== null && (
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold font-jakarta text-foreground">{card.count}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                  {card.title} 
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </h3>
                <p className="text-muted-foreground">{card.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mt-4 text-center">
        <Link 
          href="/search"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 text-lg"
        >
          <Activity className="w-6 h-6" /> Start New Search
        </Link>
      </div>

    </div>
  );
}
