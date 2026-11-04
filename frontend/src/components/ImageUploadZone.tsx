"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadZoneProps {
  onImageSelected?: (file: File) => void;
  isUploading?: boolean;
}

export function ImageUploadZone({ onImageSelected, isUploading = false }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // Create a local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`relative w-full max-w-xl mx-auto rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5 shadow-[0_0_20px_hsla(var(--primary),0.15)]"
          : "border-border/50 bg-background/50 hover:bg-muted/30 hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !previewUrl && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative aspect-video w-full h-48 bg-muted/20">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain p-2"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              <p className="text-sm font-semibold text-primary animate-pulse">Analyzing Image...</p>
            </div>
          )}
          {!isUploading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center pointer-events-none">
          <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-jakarta text-foreground mb-1">
            Drag & Drop to Search
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Drop an image of a product here, or click to browse. We&apos;ll find the best prices for it.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            Supports JPG, PNG, WEBP
          </div>
        </div>
      )}
    </div>
  );
}
