"use client";

import { useState } from "react";
import { Zap, TrendingDown, Store, ShoppingCart, Heart, History, Truck, MoreVertical, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatINR } from "@/lib/priceConverter";

export interface PriceCardProps {
  productName: string;
  price: number;
  originalPrice?: number;
  store: string;
  imageUrl?: string;
  isBestDeal?: boolean;
  discountPercentage?: number;
  shippingText?: string;
  stockStatus?: string;
  rating?: number;
  reviewCount?: number;
  badge?: {
    text: string;
    type: "primary" | "secondary" | "destructive";
  };
  onActionClick?: (e?: React.MouseEvent) => void;
  onFavoriteClick?: (e?: React.MouseEvent) => void;
  onCardClick?: () => void;
  productUrl?: string;
}

export function PriceCard({
  productName,
  price,
  originalPrice,
  store,
  imageUrl,
  isBestDeal = false,
  discountPercentage,
  shippingText,
  stockStatus,
  rating,
  reviewCount,
  badge,
  onActionClick,
  onFavoriteClick,
  onCardClick,
  productUrl,
}: PriceCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(e);
      return;
    }
    
    if (isSaved || isSaving) return;
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_title: productName,
          price: price.toString(),
          store,
          product_url: productUrl || "",
          image_url: imageUrl || "",
        }),
      });

      if (res.ok) {
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  if (isBestDeal) {
    return (
      <div 
        onClick={onCardClick}
        className="group relative bg-background border border-primary/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl best-deal-glow scale-[1.02] z-10 cursor-pointer"
      >
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 animate-wiggle uppercase tracking-wider">
            <Zap className="w-[14px] h-[14px] fill-current" />
            Best Deal
          </div>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleFavoriteClick}
            disabled={isSaving}
            className={`p-1.5 backdrop-blur-md rounded-full shadow-sm transition-colors ${isSaved ? "bg-pink-500/10 text-pink-500" : "bg-background/80 hover:text-pink-500 text-muted-foreground"}`}
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />}
          </button>
        </div>
        <div className="aspect-square bg-muted/30 overflow-hidden relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={productName}
              fill
              unoptimized={true}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-muted-foreground font-semibold group-hover:scale-110 transition-transform duration-500">
              Image Placeholder
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-primary font-bold uppercase tracking-widest">
              {store} Exclusive
            </span>
            {discountPercentage && (
              <div className="flex items-center gap-1 text-[12px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                <TrendingDown className="w-[14px] h-[14px]" />
                -{discountPercentage}%
              </div>
            )}
          </div>
          <h2 className="text-sm font-bold text-foreground line-clamp-1 mt-1" title={productName}>
            {productName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold font-jakarta text-primary">{formatINR(price)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatINR(originalPrice)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
            <div className="flex items-center gap-1">
              <Store className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground">
                {shippingText || "Ships directly"}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onActionClick?.(e); }}
              className="bg-primary/10 text-primary p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onCardClick}
      className="group bg-background border border-border/60 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
    >
      <div className="aspect-square bg-muted/20 overflow-hidden relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            unoptimized={true}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-semibold group-hover:scale-105 transition-transform duration-500">
            Image Placeholder
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleFavoriteClick}
            disabled={isSaving}
            className={`p-1.5 backdrop-blur-md rounded-full shadow-sm transition-colors ${isSaved ? "bg-pink-500/10 text-pink-500" : "bg-background/80 hover:text-pink-500 text-muted-foreground"}`}
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />}
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-semibold text-muted-foreground">{store}</span>
          {badge && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                badge.type === "primary"
                  ? "text-primary bg-primary/10"
                  : badge.type === "destructive"
                  ? "text-destructive font-bold"
                  : "text-secondary-foreground bg-secondary"
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <h2 className="text-sm font-bold text-foreground line-clamp-1 mt-1" title={productName}>
          {productName}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xl font-bold font-jakarta text-foreground">{formatINR(price)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatINR(originalPrice)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
          {rating ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
              <span className="text-[11px] font-semibold text-foreground">
                {rating} {reviewCount ? `(${reviewCount > 1000 ? (reviewCount / 1000).toFixed(1) + "k" : reviewCount})` : ""}
              </span>
            </div>
          ) : shippingText ? (
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground">{shippingText}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground">Price History</span>
            </div>
          )}

          {stockStatus ? (
            <span className="text-[11px] font-semibold text-muted-foreground font-medium">
              {stockStatus}
            </span>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); onActionClick?.(e); }} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
