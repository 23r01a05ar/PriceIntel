import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const querySchema = z.object({
  product_id: z.string().min(1, "product_id is required")
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const p_query = searchParams.get('product_id');

  const validation = querySchema.safeParse({ product_id: p_query });
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
  }

  const { product_id } = validation.data;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Internal Server Configuration Error" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if product_id is numeric to decide how to construct the query
    const isNumeric = /^\d+$/.test(product_id);
    
    let productQuery = supabase.from('products').select('product_id, name');
    
    if (isNumeric) {
      productQuery = productQuery.or(`product_id.eq.${product_id},name.eq.${product_id}`);
    } else {
      productQuery = productQuery.eq('name', product_id);
    }

    // Try to get the product
    const { data: productData, error: productError } = await productQuery.limit(1).single();

    if (productError || !productData) {
      // If no product is found, return empty history
      return NextResponse.json({ history: [] });
    }

    // Fetch prices for this product
    const { data: historyData, error: historyError } = await supabase
      .from('prices')
      .select('price, store_name, timestamp')
      .eq('product_id', productData.product_id)
      .order('timestamp', { ascending: false });

    if (historyError) {
      console.error("Price history error:", historyError);
      return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 });
    }

    // Phase 6: Call external History API ONLY if history is insufficient (<3)
    if (historyData.length < 3) {
      const { data: cacheData } = await supabase.from('history_cache').select('history_fetched').eq('product_id', productData.product_id).single();
      const hasBeenFetched = cacheData?.history_fetched === true;

      if (!hasBeenFetched) {
        console.log(`[HISTORY_API] Fetching external history for product_id: ${productData.product_id}`);
        const apiKey = process.env.RAPIDAPI_KEY;
        if (apiKey) {
          try {
            // all-in-one-price-history-tracker limited to 4 req/month
            const url = `https://all-in-one-price-history-tracker.p.rapidapi.com/history?q=${encodeURIComponent(productData.name)}`;
            const res = await fetch(url, { headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'all-in-one-price-history-tracker.p.rapidapi.com' } });
            if (res.ok) {
              const apiData = await res.json();
              const externalPoints = apiData?.data?.timeline || apiData?.timeline || [];
              
              // Insert fetched points into our DB using bulk insert
              if (externalPoints.length > 0) {
                const insertPayload = externalPoints.map((point: Record<string, unknown>) => ({
                  product_id: productData.product_id,
                  price: point.price || point.value || 0,
                  store_name: point.store || "ExternalProvider",
                  timestamp: point.date || point.timestamp || new Date().toISOString(),
                  product_url: point.url || "#"
                }));
                await supabase.from('prices').insert(insertPayload);
              }
            }
            // Mark as fetched regardless of success to avoid draining 4/mo quota on failing searches
            await supabase.from('history_cache').upsert({ product_id: productData.product_id, provider: 'all-in-one', history_fetched: true, last_fetch: new Date().toISOString() });
            
            // Refetch from DB to get the new points
            const { data: newHistoryData } = await supabase.from('prices').select('price, store_name, timestamp').eq('product_id', productData.product_id).order('timestamp', { ascending: false });
            if (newHistoryData) {
              // Replace historyData to avoid duplicates from initial query
              historyData.length = 0;
              historyData.push(...newHistoryData);
            }
          } catch (err) {
            console.error("[HISTORY_API] Error fetching external history:", err);
          }
        }
      }
    }

    const results = historyData.map(h => {
      const dateStr = new Date(h.timestamp).toISOString();
      const formattedDate = dateStr.replace('T', ' ').substring(0, 16);
      
      return {
        price: h.price,
        store: h.store_name,
        date: formattedDate
      };
    });

    return NextResponse.json({ history: results });

  } catch (error) {
    console.error("Price history route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
