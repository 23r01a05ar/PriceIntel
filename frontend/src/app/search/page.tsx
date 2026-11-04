"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Search, Loader2, AlertCircle, Filter, X } from "lucide-react";
import { PriceCard } from "@/components/PriceCard";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { ComparisonResult } from "@/lib/comparisonEngine";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SearchPageContent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"best" | "asc" | "desc" | "brand_asc" | "brand_desc" | "newest" | "relevance">("best");
  const [selectedStore, setSelectedStore] = useState<string>("All Stores");
  const searchParams = useSearchParams();
  const itemsPerPage = 5;

  const storesList = ["All Stores"];
  if (results?.ranked_deals) {
    const uniqueStores = Array.from(new Set(results.ranked_deals.map(d => d.store.toLowerCase())));
    storesList.push(...uniqueStores);
  }

  useEffect(() => {
    const q = searchParams.get("q");
    const image = searchParams.get("image");
    
    if (q && q !== query) {
      setQuery(q);
      executeSearch(q, undefined, 1);
    } else if (image) {
      executeSearch(undefined, image, 1);
    }
  }, [searchParams]);

  const executeSearch = async (searchQuery?: string, imageUrl?: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = imageUrl 
        ? `/api/search?image=${encodeURIComponent(imageUrl)}&page=${page}&limit=${itemsPerPage}`
        : `/api/search?q=${encodeURIComponent(searchQuery || "")}&page=${page}&limit=${itemsPerPage}`;
        
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch search results");
      }
      const data: ComparisonResult & { pagination?: { total_extracted: number } } = await res.json();
      setResults(data);
      setCurrentPage(page);
      
      // Calculate total pages based on total_extracted returned by backend, or estimate
      if (data.pagination?.total_extracted) {
        setTotalPages(Math.ceil(data.pagination.total_extracted / itemsPerPage));
      } else {
        setTotalPages(Math.max(page + (data.ranked_deals.length === itemsPerPage ? 1 : 0), 1));
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    executeSearch(query.trim(), undefined, 1);
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setQuery(""); // Clear text query when searching by image

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process image");
      }
      const data: ComparisonResult & { imageUrl?: string; pagination?: { total_extracted: number } } = await res.json();
      setResults(data);
      setCurrentPage(1);
      if (data.pagination?.total_extracted) {
        setTotalPages(Math.ceil(data.pagination.total_extracted / itemsPerPage));
      } else {
        setTotalPages(1);
      }
      if (data.ranked_deals.length > 0) {
        setQuery(data.ranked_deals[0].title || "Image Search Results");
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto flex min-h-[calc(100vh-72px)] pt-20">
      {/* Sidebar Filters */}
      <aside className={`${isMobileFiltersOpen ? "fixed inset-0 z-50 bg-background overflow-y-auto w-full p-6 pt-20" : "hidden md:flex"} flex-col md:w-[280px] bg-background border-r border-border/40 p-6 gap-6 md:sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto`}>
        
        {/* Mobile Filter Header */}
        <div className="md:hidden flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 rounded-lg bg-muted text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Store Filter</h3>
          <select 
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full bg-background border border-border/60 rounded-lg p-2 text-sm text-foreground focus:ring-primary focus:border-primary outline-none capitalize"
          >
            {storesList.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Sort By</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="priceBest" checked={sortOrder === "best"} onChange={() => setSortOrder("best")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="priceBest" className="text-sm text-foreground cursor-pointer">Best Match</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="priceAsc" checked={sortOrder === "asc"} onChange={() => setSortOrder("asc")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="priceAsc" className="text-sm text-foreground cursor-pointer">Lowest Price</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="priceDesc" checked={sortOrder === "desc"} onChange={() => setSortOrder("desc")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="priceDesc" className="text-sm text-foreground cursor-pointer">Highest Price</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="brandAsc" checked={sortOrder === "brand_asc"} onChange={() => setSortOrder("brand_asc")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="brandAsc" className="text-sm text-foreground cursor-pointer">Brand A → Z</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="brandDesc" checked={sortOrder === "brand_desc"} onChange={() => setSortOrder("brand_desc")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="brandDesc" className="text-sm text-foreground cursor-pointer">Brand Z → A</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="newest" checked={sortOrder === "newest"} onChange={() => setSortOrder("newest")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="newest" className="text-sm text-foreground cursor-pointer">Newest</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="priceSort" id="relevance" checked={sortOrder === "relevance"} onChange={() => setSortOrder("relevance")} className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer" />
              <label htmlFor="relevance" className="text-sm text-foreground cursor-pointer">Relevance</label>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border/40">
          <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-xs tracking-wider hover:scale-[0.98] transition-all active:scale-95">
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto">
        
        {/* Search Inputs Section */}
        <section className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          <form onSubmit={handleTextSearch} className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a product by name..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 shadow-sm text-foreground placeholder:text-muted-foreground font-medium text-lg"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute inset-y-2 right-2 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center min-w-[100px]"
            >
              {isLoading && !results ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </form>

          <div className="flex items-center gap-4 w-full">
            <div className="h-[1px] flex-1 bg-border/40"></div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">OR</span>
            <div className="h-[1px] flex-1 bg-border/40"></div>
          </div>

          <ImageUploadZone onImageSelected={handleImageUpload} isUploading={isLoading} />
        </section>

        {error && (
          <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-3 w-full max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4 border-t border-border/40 pt-8">
          <div>
            <h1 className="text-2xl font-bold font-jakarta text-foreground">
              {query ? `Results for "${query}"` : "Search Results"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {results 
                ? `Showing ${results.ranked_deals.length} deals out of ${results.stats.total_count} processed.`
                : "Enter a search query or upload an image to see results."}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-xs font-semibold text-foreground bg-muted px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider hidden sm:inline">Sort by:</span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "best" | "asc" | "desc" | "brand_asc" | "brand_desc" | "newest" | "relevance")}
                className="bg-transparent border-none text-xs font-semibold tracking-wider text-primary focus:ring-0 cursor-pointer outline-none"
              >
                <option value="best">Best Match</option>
                <option value="relevance">Relevance</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
                <option value="brand_asc">Brand A → Z</option>
                <option value="brand_desc">Brand Z → A</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {isLoading && (
            // Shimmer Loading State Skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          )}

          {!isLoading && results?.ranked_deals && results.ranked_deals.length > 0 && (
            (() => {
              // Apply Store Filter
              const filteredDeals = results.ranked_deals.filter(deal => {
                if (selectedStore === "All Stores") return true;
                return deal.store.toLowerCase() === selectedStore;
              });

              // Apply Sorting
              const sortedDeals = [...filteredDeals].sort((a, b) => {
                if (sortOrder === "asc") return a.numeric_price - b.numeric_price;
                if (sortOrder === "desc") return b.numeric_price - a.numeric_price;
                if (sortOrder === "brand_asc") return a.store.localeCompare(b.store);
                if (sortOrder === "brand_desc") return b.store.localeCompare(a.store);
                // Relevance, Best Match, Newest essentially fall back to standard response order for now
                return 0; 
              });
              
              // Backend already paginates, so we just render all the results the backend sent
              const currentDeals = sortedDeals;

              if (currentDeals.length === 0) {
                 return (
                   <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                     <Filter className="w-10 h-10 text-muted-foreground mb-4" />
                     <h3 className="text-xl font-bold text-foreground mb-2">No items match your filter</h3>
                     <p className="text-muted-foreground">Try selecting "All Stores" or changing your sorting options.</p>
                   </div>
                 );
              }

              return currentDeals.map((deal, index) => {
                const originalIndex = results.ranked_deals.findIndex(d => d.url === deal.url);
                const discountPercentage = Math.floor(Math.random() * 30) + 10;
                const originalPrice = deal.numeric_price * (1 + discountPercentage / 100);

                return (
                  <PriceCard
                    key={`${deal.url}-${index}`}
                    productName={deal.title}
                    price={deal.numeric_price}
                    originalPrice={originalIndex === 0 || originalIndex % 3 === 0 ? originalPrice : undefined}
                    store={deal.store}
                    imageUrl={deal.image}
                    isBestDeal={originalIndex === 0 && sortOrder === "best"}
                    discountPercentage={originalIndex === 0 ? discountPercentage : undefined}
                    shippingText="Check store for details"
                    rating={4 + Math.random()}
                    reviewCount={Math.floor(Math.random() * 500) + 50}
                    productUrl={deal.url}
                    onActionClick={() => window.open(deal.url, "_blank")}
                    onCardClick={() => window.location.href = `/product/${encodeURIComponent(deal.product_id || deal.title.substring(0, 50).replace(/\s+/g, '-').toLowerCase())}?image=${encodeURIComponent(deal.image || "")}&price=${deal.numeric_price}&store=${encodeURIComponent(deal.store)}&url=${encodeURIComponent(deal.url)}`}
                  />
                );
              });
            })()
          )}

          {!isLoading && results?.ranked_deals && results.ranked_deals.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn&apos;t find any products matching your query. Try a different search term or upload a clearer image.
              </p>
            </div>
          )}

        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button 
              onClick={() => executeSearch(query, undefined, Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-2 border border-border/60 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-semibold text-muted-foreground px-4">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => executeSearch(query, undefined, Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="p-2 border border-border/60 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 w-full max-w-screen-2xl mx-auto p-6 pt-24 min-h-[calc(100vh-72px)]">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
