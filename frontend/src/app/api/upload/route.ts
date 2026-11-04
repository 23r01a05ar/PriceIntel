import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { searchStoreWithFallback } from '@/lib/providerEngine';
import { comparePrices } from '@/lib/comparisonEngine';
import { ProductResult, cleanPrice } from '@/lib/productSearch';
import { STORAGE_BUCKET } from '@/config/storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 1. Initialize Supabase Client with User Session
    const supabase = createClient();
    
    // Validate authentication (optional but recommended for uploads)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("Upload attempted by unauthenticated user");
      // Depending on RLS policies, unauthenticated uploads might be allowed or denied.
      // We will proceed and let Supabase RLS handle the rejection if necessary.
    }
    
    // 2. Upload Image to Supabase Storage
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Convert File to ArrayBuffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let uploadError = null;
    const { error: initialError } = await supabase.storage
      .from(STORAGE_BUCKET) // Shared bucket configuration
      .upload(`uploads/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false
      });
      
    uploadError = initialError;

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", JSON.stringify(uploadError, null, 2));
      return NextResponse.json(
        { 
          error: "Image upload failed. See server logs for details.", 
          details: uploadError.message || uploadError.name || "Unknown error" 
        }, 
        { status: 500 }
      );
    }
    
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`uploads/${fileName}`);
      
    const imageUrl = publicUrlData.publicUrl;

    // 3. Extract Product Name via ChatGPT Vision
    let searchQuery = "Laptop"; // Fallback
    try {
      const visionRes = await fetch("https://chatgpt-vision1.p.rapidapi.com/matagvision2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "chatgpt-vision1.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || ""
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Identify the primary consumer product in this image. Reply with ONLY the precise product name (e.g., 'Dell XPS 15 2023', 'Nike Air Force 1', 'Apple iPhone 14 Pro'). Do not include any extra text." },
                { type: "image", url: imageUrl }
              ]
            }
          ],
          web_access: false
        })
      });
      
      const visionData = await visionRes.json();
      if (visionData && visionData.result) {
        searchQuery = visionData.result.trim();
        console.log(`[Vision API] Identified product: "${searchQuery}"`);
      }
    } catch (visionErr) {
      console.error("[Vision API] Failed to extract product name:", visionErr);
    }

    // 4. Run standard multi-provider search with the extracted text query
    const targetStores = ['amazon', 'flipkart', 'walmart', 'realtimeproductsearch'];
    const allDeals: ProductResult[] = [];
    const storeResults = await Promise.allSettled(
      targetStores.map(store => searchStoreWithFallback(store, searchQuery, 1, 12))
    );
    
    for (const result of storeResults) {
      if (result.status === 'fulfilled' && result.value) {
        allDeals.push(...result.value);
      }
    }
    
    if (!allDeals || allDeals.length === 0) {
      return NextResponse.json({ error: `No products found for identified product: "${searchQuery}"` }, { status: 404 });
    }

    // 5. Send to Comparison Engine
    const comparisonResult = comparePrices(allDeals);

    return NextResponse.json({
      imageUrl, // Return the uploaded image URL so frontend can display it
      identified_product: searchQuery,
      ...comparisonResult
    });

  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
