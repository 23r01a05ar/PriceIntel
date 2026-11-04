import { NextResponse } from 'next/server';
import { z } from 'zod';
import { searchStoreWithFallback } from '@/lib/providerEngine';
import { comparePrices } from '@/lib/comparisonEngine';
import { ProductResult } from '@/lib/productSearch';
import { createClient } from '@/lib/supabaseServer';

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(100, "Query is too long"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q') || searchParams.get('query');
  
  if (!rawQuery) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 });
  }

  const query = rawQuery;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  
  console.log(`[API Search] Received request. Query: "${query}", Page: ${page}, Limit: ${limit}`);

  // Log to search_history if authenticated (non-blocking)
  const supabase = createClient();
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) {
      supabase.from('search_history').insert({
        user_id: user.id,
        query: query
      }).then(({ error }) => {
        if (error) console.error("Search history logging failed:", error);
      });
    }
  }).catch(err => console.error("Error getting user for search history:", err));

  try {
    // Run all stores in parallel using the fallback-enabled generic engine
    const allDeals: ProductResult[] = [];
    
    // Use Amazon fallback + all text search providers from API_SNIPPETS
    const targetStores = ['amazon', 'flipkart', 'walmart', 'realtimeproductsearch'];
    console.log(`[API Search] Executing fallback for Target Stores: ${targetStores.join(', ')}`);
    const storeResults = await Promise.allSettled(
      targetStores.map(store => searchStoreWithFallback(store, query, page, limit))
    );
    
    for (const result of storeResults) {
      if (result.status === 'fulfilled' && result.value) {
        allDeals.push(...result.value);
      }
    }
    
    // Apply ranking algorithm
    const comparisonResult = comparePrices(allDeals);
    console.log(`[API Search] Returning ${comparisonResult.ranked_deals.length} mapped products to frontend.`);
    
    // Add pagination metadata and apply limit
    const responsePayload = {
      stats: comparisonResult.stats,
      ranked_deals: comparisonResult.ranked_deals.slice(0, limit),
      pagination: {
        page,
        limit,
        total_extracted: allDeals.length
      }
    };

    // Asynchronously log price history to build the tracking database
    if (comparisonResult.ranked_deals.length > 0 && page === 1) {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceKey) {
        console.error("[CRITICAL] SUPABASE_SERVICE_ROLE_KEY is missing. Price history inserts will likely fail due to RLS.");
      }
      const adminSupabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // We wrap this in a self-executing async function so it doesn't block the response
      (async () => {
        try {
          const topDeals = comparisonResult.ranked_deals.slice(0, 20);
          const dealNames = topDeals.map(d => d.normalized_title);
          
          // 1. Bulk check existing products
          const { data: existingProducts } = await adminSupabase
            .from('products')
            .select('product_id, name')
            .in('name', dealNames);
            
          const existingMap = new Map((existingProducts || []).map(p => [p.name, p.product_id]));
          
          // 2. Insert missing products
          const missingDeals = topDeals.filter(d => !existingMap.has(d.normalized_title));
          const uniqueMissingDeals = Array.from(new Map(missingDeals.map(d => [d.normalized_title, d])).values());
          
          if (uniqueMissingDeals.length > 0) {
            const productsToInsert = uniqueMissingDeals.map(deal => ({
              name: deal.normalized_title,
              category: query.substring(0, 100),
              image_url: deal.image
            }));
            
            const { data: insertedProducts, error: productError } = await adminSupabase
              .from('products')
              .insert(productsToInsert)
              .select('product_id, name');
              
            if (productError) {
              console.error(`[DB Error] Bulk Product insert failed:`, productError);
            }
            if (insertedProducts) {
              insertedProducts.forEach(p => existingMap.set(p.name, p.product_id));
            }
          }
          
          // Attach product_ids to frontend payload reference and prepare prices
          const pricesToInsert: Record<string, unknown>[] = [];
          const productIdsToTrack = new Set<string>();
          
          for (const deal of topDeals) {
            const productId = existingMap.get(deal.normalized_title);
            if (productId) {
              deal.product_id = String(productId);
              pricesToInsert.push({
                product_id: productId,
                store_name: deal.store,
                price: deal.numeric_price,
                product_url: deal.url
              });
              productIdsToTrack.add(String(productId));
            }
          }
          
          // 3. Bulk insert prices
          if (pricesToInsert.length > 0) {
            const { error: priceError } = await adminSupabase.from('prices').insert(pricesToInsert);
            if (priceError) console.error(`[DB Error] Bulk Price insert failed:`, priceError);
          }
          
          // 4. Bulk update tracked_products
          const trackIdsArray = Array.from(productIdsToTrack);
          if (trackIdsArray.length > 0) {
            const { data: existingTracks } = await adminSupabase
              .from('tracked_products')
              .select('product_id, search_count')
              .in('product_id', trackIdsArray);
              
            const trackMap = new Map((existingTracks || []).map(t => [String(t.product_id), t.search_count]));
            
            const tracksToInsert: Record<string, unknown>[] = [];
            
            for (const pid of trackIdsArray) {
              const currentCount = Number(trackMap.get(pid) || 0);
              const newCount = currentCount + 1;
              const isActive = newCount > 5;
              
              if (trackMap.has(pid)) {
                // Update existing
                await adminSupabase.from('tracked_products')
                  .update({ search_count: newCount, last_seen: new Date().toISOString(), is_active: isActive })
                  .eq('product_id', pid);
              } else {
                // Insert new
                tracksToInsert.push({
                  product_id: pid,
                  search_count: 1,
                  last_seen: new Date().toISOString(),
                  is_active: false
                });
              }
            }
            
            if (tracksToInsert.length > 0) {
               await adminSupabase.from('tracked_products').insert(tracksToInsert);
            }
          }
          
        } catch (err) {
          console.error("Price history background task failed:", err);
        }
      })();
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to process search request" }, { status: 500 });
  }
}
