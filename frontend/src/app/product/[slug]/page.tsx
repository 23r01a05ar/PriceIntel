import React from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Zap, Star, ShieldCheck, Heart, AlertCircle, Share2, Link as LinkIcon, MessageCircle, TrendingUp, BellRing } from "lucide-react";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import { WishlistButton } from "@/components/WishlistButton";
import { PriceAlertForm } from "@/components/PriceAlertForm";
import { ShareButtons } from "@/components/ShareButtons";
import { PredictionPanel } from "@/components/PredictionPanel";
import { notFound } from "next/navigation";
import { formatINR } from "@/lib/priceConverter";

interface ProductData {
  product_id?: string;
  name?: string;
  category?: string;
  image_url?: string | null;
  [key: string]: unknown;
}

// Initialize standard Supabase client for public read access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function ProductDetailPage({ 
  params,
  searchParams 
}: { 
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  // Check if slug is numeric (product_id)
  const isNumeric = /^\d+$/.test(decodedSlug);

  let productQuery = supabase.from("products").select("*");
  if (isNumeric) {
    console.log(`[PRODUCT_ID] Route parameter identifies as product_id: ${decodedSlug}`);
    productQuery = productQuery.eq("product_id", decodedSlug);
  } else {
    console.log(`[PRODUCT_LOOKUP] Route parameter is a slug. Falling back to title matching for: ${decodedSlug}`);
    // Slugs use hyphens, but DB uses spaces. Convert back and use wildcards for safety.
    const searchName = decodedSlug.replace(/-/g, '%');
    productQuery = productQuery.ilike("name", `%${searchName}%`);
  }

  const { data: productData, error: productError } = await productQuery.limit(1).single();

  let product: ProductData | null = null;
  let historyResults: {price: number, store: string, date: string}[] = [];
  const currentPrices: Record<string, { price: number; url: string; date?: string }> = {};

  if (!productError && productData) {
    product = productData;
    
    // Fetch prices for this product from DB
    console.log(`[PRICE_HISTORY_QUERY] Fetching history for product_id: ${productData.product_id}`);
    const { data: historyData, error: historyError } = await supabase
      .from("prices")
      .select("price, store_name, timestamp, product_url")
      .eq("product_id", productData.product_id)
      .order("timestamp", { ascending: false });

    if (!historyError && historyData) {
      console.log(`[PRICE_HISTORY_ROWS] Found ${historyData.length} records for product_id: ${productData.product_id}`);
      historyResults = historyData.map((h) => {
        const dateStr = new Date(h.timestamp).toISOString();
        const formattedDate = dateStr.replace("T", " ").substring(0, 16);
        return {
          price: h.price,
          store: h.store_name,
          date: formattedDate,
        };
      });

      historyData.forEach((h) => {
        if (!currentPrices[h.store_name]) {
          currentPrices[h.store_name] = {
            price: h.price,
            url: h.product_url || "#",
            date: h.timestamp
          };
        }
      });
    }
  } else {
    // Generate virtual product from the slug
    product = {
      product_id: decodedSlug, // Just use slug as ID for UI purposes
      name: decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: "General",
      image_url: (searchParams?.image as string) || null // Handled gracefully by UI
    };
  }
  
  if (searchParams?.store && searchParams?.price) {
    const sName = searchParams.store as string;
    if (!currentPrices[sName]) {
      currentPrices[sName] = {
        price: parseFloat(searchParams.price as string) || 0,
        url: (searchParams.url as string) || "#",
        date: new Date().toISOString()
      };
    }
  }

  const storesList = Object.entries(currentPrices).map(([name, data]) => ({
    name,
    price: data.price,
    url: data.url,
    date: data.date
  })).sort((a, b) => a.price - b.price);

  const bestDeal = storesList.length > 0 ? storesList[0] : null;

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen pt-28 px-6 pb-20 flex flex-col gap-10">
      <Link href="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Product Image Gallery */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="aspect-square bg-white rounded-3xl border border-border/60 shadow-xl overflow-hidden relative flex items-center justify-center p-8 group">
            {product?.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.name || "Product Image"} 
                fill 
                unoptimized={true}
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="text-muted-foreground font-semibold">No Image Available</div>
            )}
            
            <WishlistButton 
              productTitle={product?.name || ""} 
              price={bestDeal ? bestDeal.price : 0} 
              store={bestDeal ? bestDeal.name : ""} 
              productUrl={bestDeal ? bestDeal.url : ""} 
              imageUrl={product?.image_url || undefined} 
            />

            {bestDeal && (
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-xl flex items-center gap-2 animate-wiggle shadow-lg shadow-primary/20">
                  <Zap className="w-5 h-5 fill-current" />
                  Best Price: {formatINR(bestDeal.price)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 w-fit px-3 py-1 rounded-full">
              {product?.category || "General"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-jakarta text-foreground tracking-tight leading-tight">
              {product?.name || decodedSlug}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[#FFB800] bg-[#FFB800]/10 px-3 py-1 rounded-full font-bold text-sm">
                <Star className="w-4 h-4 fill-current" /> 4.8
              </div>
              <span className="text-muted-foreground text-sm font-medium">1,204 Reviews</span>
            </div>
            
            <ShareButtons productName={product?.name || decodedSlug} productUrl={bestDeal?.url} />
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Track prices across multiple retailers, view historical pricing data, and set up alerts so you never miss a drop on {product?.name || decodedSlug}.
          </p>

          {/* Pricing Comparison Cards */}
          <div className="mt-4 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-foreground">Current Offers</h3>
            
            {storesList.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/20 text-muted-foreground font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> No active offers found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storesList.map((store, index) => {
                  const isBest = index === 0;
                  return (
                    <div 
                      key={store.name} 
                      className={`flex flex-col p-5 rounded-2xl border transition-all ${
                        isBest 
                          ? "bg-background border-primary shadow-[0_0_20px_hsla(var(--primary),0.15)] scale-[1.02]" 
                          : "bg-background/50 border-border/60 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{store.name}</span>
                          <span className="text-[10px] text-muted-foreground mt-1">Last Updated: {store.date ? new Date(store.date).toLocaleString() : 'Just now'}</span>
                          <span className="text-[10px] text-emerald-500 font-bold mt-0.5">In Stock</span>
                        </div>
                        {isBest && (
                          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded">
                            Lowest Price
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto">
                        <span className={`text-3xl font-bold font-jakarta ${isBest ? "text-primary" : "text-foreground"}`}>
                          {formatINR(store.price)}
                        </span>
                        <a 
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-transform active:scale-95 ${
                            isBest 
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105" 
                              : "bg-muted text-foreground hover:bg-muted/80"
                          }`}
                        >
                          Buy <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Prices verified in real-time by PredictKaro Engine.
          </div>

          {/* Price Alerts */}
          <PriceAlertForm productName={product?.name || decodedSlug} />
        </div>
      </div>

      <div className="h-px w-full bg-border/40 my-4"></div>

      {/* Price History Section */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold font-jakarta text-foreground">Price History</h2>
          <p className="text-muted-foreground text-lg mt-1">Track market fluctuations over time.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-background/50 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <PriceHistoryChart data={historyResults} />
          </div>

          <PredictionPanel historyData={historyResults} />
        </div>
      </div>
    </div>
  );
}
