import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { searchStoreWithFallback } from '@/lib/providerEngine';

export async function GET(request: Request) {
  // Security check: ensure cron secret if using Vercel
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Missing Service Role Key" }, { status: 500 });
  }
  
  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  );

  try {
    // 1. Read tracked_products
    const { data: trackedProducts, error: trackError } = await adminSupabase
      .from('tracked_products')
      .select('product_id, is_active, products(name, category)')
      .eq('is_active', true)
      .limit(50); // limit per execution to avoid timeouts

    if (trackError || !trackedProducts) {
      throw new Error(`Failed to fetch tracked products: ${trackError?.message}`);
    }

    const results = [];

    const pricesToInsert = [];
    const productIdsToUpdate = [];

    // 2. Fetch latest prices
    for (const track of trackedProducts) {
      try {
        // Handle Supabase joining giving an array or single object
        const productsArr = Array.isArray(track.products) ? track.products : [track.products];
        const productName = productsArr[0]?.name;
        if (!productName) continue;

        // Perform search across providers
        const targetStores = ['amazon', 'flipkart', 'walmart'];
        for (const store of targetStores) {
          const deals = await searchStoreWithFallback(store, productName, 1, 3);
          
          if (deals && deals.length > 0) {
            // Find best matching deal (exact match or closest)
            const bestDeal = deals[0]; // Simplification for MVP

            // 3. Queue snapshots (append only)
            pricesToInsert.push({
              product_id: track.product_id,
              store_name: bestDeal.store,
              price: bestDeal.numeric_price,
              product_url: bestDeal.url
            });

            results.push({ product_id: track.product_id, store: bestDeal.store, price: bestDeal.numeric_price });
          }
        }

        // 4. Queue update last_seen
        productIdsToUpdate.push(track.product_id);

      } catch (err) {
        console.error(`Error processing product ${track.product_id}:`, err);
      }
    }

    // Bulk insert all prices
    if (pricesToInsert.length > 0) {
        await adminSupabase.from('prices').insert(pricesToInsert);
    }
    
    // Bulk update last_seen (using an IN clause)
    if (productIdsToUpdate.length > 0) {
        await adminSupabase
          .from('tracked_products')
          .update({ last_seen: new Date().toISOString() })
          .in('product_id', productIdsToUpdate);
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error: unknown) {
    console.error("Cron Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
