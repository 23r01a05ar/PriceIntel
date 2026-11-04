import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto min-h-screen pt-28 px-6 pb-20 flex flex-col gap-10">
      <Skeleton className="w-32 h-6" /> {/* Back to search */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Image Skeleton */}
        <div className="lg:col-span-5">
          <Skeleton className="w-full aspect-square rounded-3xl" />
        </div>

        {/* Details Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="w-24 h-6 rounded-full" /> {/* Category */}
            <Skeleton className="w-3/4 h-12" /> {/* Title */}
            <Skeleton className="w-48 h-6" /> {/* Reviews */}
          </div>

          <Skeleton className="w-full h-20" /> {/* Description */}

          <div className="mt-4 flex flex-col gap-4">
            <Skeleton className="w-40 h-8" /> {/* Current Offers title */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="w-full h-32 rounded-2xl" />
              <Skeleton className="w-full h-32 rounded-2xl" />
            </div>
          </div>
          
          <Skeleton className="w-full h-24 rounded-2xl mt-4" /> {/* Price Alerts */}
        </div>
      </div>

      <div className="h-px w-full bg-border/40 my-4"></div>

      {/* History and Prediction Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="w-full h-96 rounded-3xl" />
        </div>
        <div className="md:col-span-1">
          <Skeleton className="w-full h-96 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
