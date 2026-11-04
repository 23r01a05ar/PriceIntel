"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Search, AlertCircle, Trash2 } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";
import Link from "next/link";
import { PriceCard } from "@/components/PriceCard";

interface WishlistItem {
  wish_id: string;
  product_id?: number | null;
  product_title: string;
  price: string | null;
  store: string | null;
  product_url: string | null;
  image_url: string | null;
  timestamp: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login if not authenticated
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/wishlist?t=${Date.now()}`);
        if (!res.ok) {
          throw new Error("Failed to load wishlist");
        }
        const data = await res.json();
        setItems(data.wishlist || []);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [router]);

  const handleRemove = async (wish_id: string) => {
    try {
      const res = await fetch(`/api/wishlist?wish_id=${wish_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.wish_id !== wish_id));
      } else {
        console.error("Failed to delete wishlist item");
      }
    } catch (err) {
      console.error(err);
    }
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
    <div className="max-w-screen-2xl mx-auto min-h-screen pt-28 px-6 pb-12 flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-[0_0_20px_hsla(var(--primary),0.15)]">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-jakarta text-foreground tracking-tight">Saved Deals</h1>
            <p className="text-muted-foreground font-medium mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>
        
        <Link 
          href="/search" 
          className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" /> Find More Deals
        </Link>
      </div>

      <div className="h-px w-full bg-border/40"></div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 w-full">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.wish_id} className="relative group">
            <PriceCard
              productName={item.product_title}
              price={parseFloat(item.price || "0")}
              store={item.store || "Unknown"}
              imageUrl={item.image_url || undefined}
              onActionClick={() => window.open(item.product_url || "#", "_blank")}
              onCardClick={() => {
                const searchParams = new URLSearchParams({
                  price: item.price || "0",
                  store: item.store || "Unknown",
                  image: item.image_url || "",
                  url: item.product_url || ""
                });
                const routeId = item.product_id ? String(item.product_id) : encodeURIComponent(item.product_title.substring(0, 50).replace(/\s+/g, '-').toLowerCase());
                window.location.href = `/product/${routeId}?${searchParams.toString()}`;
              }}
            />
            {/* Overlay Delete Button */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button
                onClick={() => handleRemove(item.wish_id)}
                className="p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground backdrop-blur-md rounded-lg shadow-sm transition-colors flex items-center gap-1 text-xs font-bold"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-background/50 border border-dashed border-border/60 rounded-3xl">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-jakarta text-foreground mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-sm mb-8 text-lg">
            Save items you want to keep an eye on, and we'll alert you when their prices drop.
          </p>
          <Link 
            href="/search"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold tracking-wide hover:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Start Searching
          </Link>
        </div>
      )}
    </div>
  );
}
