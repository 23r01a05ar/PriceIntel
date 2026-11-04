"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  productName: string;
  productUrl?: string;
}

export function ShareButtons({ productName, productUrl }: ShareButtonsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = productUrl || window.location.href;
    const shareData = {
      title: `Check out ${productName}`,
      text: `Found a great deal for ${productName}!`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const copyToClipboard = () => {
    const url = productUrl || window.location.href;
    navigator.clipboard.writeText(url);
    alert('Store link copied to clipboard!');
  };

  const shareToWhatsApp = () => {
    const url = productUrl || window.location.href;
    window.open(`https://wa.me/?text=Check out this deal on ${encodeURIComponent(productName)}: ${encodeURIComponent(url)}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = productUrl || window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=Check out this deal on ${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Share:</span>
      <button 
        onClick={shareToWhatsApp}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#25D366] hover:text-white transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button 
        onClick={copyToClipboard}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        title="Copy Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button 
        onClick={shareToTwitter}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        title="Share on Twitter"
      >
        <Share2 className="w-4 h-4" />
      </button>
      {mounted && typeof navigator.share === 'function' && (
        <button 
          onClick={handleShare}
          className="px-3 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-colors ml-2"
          title="Native Share"
        >
          Share
        </button>
      )}
    </div>
  );
}
