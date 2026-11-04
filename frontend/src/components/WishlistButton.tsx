"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productTitle: string;
  price: number;
  store: string;
  productUrl: string;
  imageUrl?: string;
  productId?: string;
}

export function WishlistButton({
  productTitle,
  price,
  store,
  productUrl,
  imageUrl,
  productId,
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (isSaved) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          product_title: productTitle,
          price: price.toString(),
          store,
          product_url: productUrl,
          image_url: imageUrl || "",
        }),
      });

      if (res.ok) {
        setIsSaved(true);
      } else {
        console.error("Failed to save to wishlist");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSave}
      disabled={isLoading || isSaved}
      className={`absolute top-4 right-4 p-3 backdrop-blur-md rounded-full shadow-lg transition-colors z-10 hover:scale-110 active:scale-95 ${isSaved ? "bg-pink-500/10 text-pink-500" : "bg-background/80 text-muted-foreground hover:text-pink-500"}`}
    >
      <Heart className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
    </button>
  );
}
