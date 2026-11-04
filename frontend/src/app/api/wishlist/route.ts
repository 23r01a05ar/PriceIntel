import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { z } from 'zod';

const postSchema = z.object({
  product_id: z.string().optional(),
  product_title: z.string().min(1, "Product title is required"),
  price: z.string().optional().or(z.literal('')),
  store: z.string().optional().or(z.literal('')),
  product_url: z.string().url("Invalid product URL").optional().or(z.literal('')),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal(''))
});

const deleteSchema = z.object({
  wish_id: z.string().min(1, "wish_id is required")
});

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Wishlist GET error:", error);
      return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }

    return NextResponse.json({ wishlist: data });
  } catch (err) {
    console.error("Wishlist API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = postSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const itemData = validation.data;

    // Check if item already exists for this user
    const { data: existingItem } = await supabase
      .from('wishlist')
      .select('wish_id')
      .eq('user_id', user.id)
      .eq('product_title', itemData.product_title)
      .single();

    if (existingItem) {
      return NextResponse.json({ success: true, message: "Item already in wishlist", item: existingItem }, { status: 200 });
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        product_id: itemData.product_id ? String(itemData.product_id) : null,
        product_title: itemData.product_title,
        price: itemData.price || null,
        store: itemData.store || null,
        product_url: itemData.product_url || null,
        image_url: itemData.image_url || null
      })
      .select()
      .single();

    if (error) {
      console.error("Wishlist POST error:", error);
      return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (err) {
    console.error("Wishlist API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const wish_id = searchParams.get('wish_id');
    
    const validation = deleteSchema.safeParse({ wish_id });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('wish_id', validation.data.wish_id)
      .eq('user_id', user.id); // Security: ensure user owns this item

    if (error) {
      console.error("Wishlist DELETE error:", error);
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Wishlist API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
