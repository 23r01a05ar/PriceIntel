"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Camera, TrendingDown, BellRing, Bookmark, Sparkles, Scale, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatINRDirect } from "@/lib/priceConverter";

export default function Home() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          router.push(`/search?image=${encodeURIComponent(data.imageUrl)}`);
        }
      } else {
        console.error("Upload failed");
        setIsUploading(false);
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section id="search-section" className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsla(var(--primary)/0.05)_0%,_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-jakarta text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4"
          >
            Find the best deal <span className="text-primary">instantly.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            PredictKaro aggregates global market data to ensure you never overpay again. Use our AI-powered visual search to find products from a single photo.
          </motion.p>

          {/* Signature Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto group"
          >
            <form onSubmit={handleSearch} className="flex items-center bg-background border border-border shadow-sm rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
              <div className="pl-6 pr-2 cursor-pointer" onClick={handleSearch}>
                <Search className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </div>
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow py-6 bg-transparent border-none focus:outline-none focus:ring-0 text-lg placeholder:text-muted-foreground/60"
                placeholder="Paste product link or search name..."
                type="text"
              />
              <div className="flex items-center pr-2 gap-1">
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors group/camera disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Camera className="w-5 h-5 text-primary" />}
                  <span className="hidden sm:inline text-xs font-semibold tracking-wider text-primary">
                    {isUploading ? "Uploading..." : "Image Search"}
                  </span>
                </button>
              </div>
            </form>
            {/* Drag & Drop Zone Overlay */}
            <div className="mt-4 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Or drag and drop an image anywhere
              </span>
            </div>
          </motion.div>
        </div>

        {/* Floating Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 relative max-w-5xl mx-auto px-6 flex justify-center"
        >
          <div className="relative w-full max-w-md bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-1000">
            <div className="aspect-[4/3] bg-white p-6 flex items-center justify-center relative border-b border-border">
              <Image 
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1500&q=80" 
                alt="Dell Inspiron 15 Gen 14" 
                fill 
                unoptimized={true}
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold font-jakarta text-foreground">Dell Inspiron 15 Gen 14</h3>
                  <p className="text-sm text-muted-foreground">Intel Core Ultra • 16GB RAM • 512GB SSD</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-jakarta text-primary">{formatINRDirect(24817)}</span>
                  <div className="flex items-center justify-end gap-1 text-destructive text-[11px] font-semibold">
                    <TrendingDown className="w-[14px] h-[14px]" />
                    12% Drop
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex-grow bg-primary/10 rounded-lg p-2 border border-primary/20">
                  <span className="text-[11px] font-semibold text-primary uppercase">Best Price</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Amazon.com</span>
                    <span className="text-sm text-primary font-bold">{formatINRDirect(24817)}</span>
                  </div>
                </div>
                <div className="flex-grow bg-muted/50 rounded-lg p-2 border border-border/50">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">Market Avg</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Target</span>
                    <span className="text-sm text-muted-foreground">{formatINRDirect(28219)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-background border-y border-border/40">
        <div className="max-w-screen-2xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
            Trusted by 10k+ shoppers from global retailers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-xl font-bold tracking-tight">AMAZON</div>
            <div className="text-xl font-extrabold tracking-tight text-destructive">TARGET</div>
            <div className="text-xl font-black tracking-tighter">WALMART</div>
            <div className="text-xl font-bold italic">eBay</div>
            <div className="text-xl font-bold">BestBuy</div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-6 max-w-screen-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-jakarta mb-2 text-foreground">Tools for the strategic shopper.</h2>
          <p className="text-lg text-muted-foreground">Surgical precision in every search result.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Search className="w-6 h-6" />,
              title: "Global Text Search",
              desc: "Search millions of products across 500+ retailers with instant result filtering."
            },
            {
              icon: <Camera className="w-6 h-6" />,
              title: "Visual Intelligence",
              desc: "Snap or upload a photo to find exact matches or similar products at lower prices."
            },
            {
              icon: <Scale className="w-6 h-6" />,
              title: "Price Comparison",
              desc: "Side-by-side analysis of pricing, shipping costs, and delivery estimates."
            },
            {
              icon: <BellRing className="w-6 h-6" />,
              title: "Instant Alerts",
              desc: "Set target prices and get notified the millisecond the market moves in your favor."
            },
            {
              icon: <Bookmark className="w-6 h-6" />,
              title: "Smart Wishlists",
              desc: "Organize your shopping across different retailers in a single, unified dashboard."
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "AI Recommendations",
              desc: "Personalized product suggestions based on your price history and preferences."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-background border border-border rounded-xl hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-jakarta mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-jakarta mb-6 text-primary-foreground">Ready to save?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of smart shoppers using PredictKaro to dominate the market.</p>
          <button
            onClick={() => {
              document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                searchInputRef.current?.focus();
              }, 500);
            }}
            className="inline-block bg-primary-foreground text-primary px-8 py-4 rounded-xl font-bold tracking-wide hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Start Comparing Prices
          </button>
        </motion.div>
      </section>
    </div>
  );
}
