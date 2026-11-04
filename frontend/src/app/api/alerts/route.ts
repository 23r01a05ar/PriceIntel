import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { z } from 'zod';

const postSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  target_price: z.number().min(0, "Target price must be positive"),
  user_email: z.string().email("Valid email is required")
});

const patchSchema = z.object({
  alert_id: z.number(),
  target_price: z.number().min(0, "Target price must be positive").optional(),
  is_active: z.boolean().optional()
});

const deleteSchema = z.object({
  alert_id: z.string().min(1, "alert_id is required")
});

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Alerts GET error:", error);
      return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
    }

    return NextResponse.json({ alerts: data });
  } catch (err) {
    console.error("Alerts API error:", err);
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

    const { data, error } = await supabase
      .from('price_alerts')
      .insert({
        user_id: user.id,
        product_name: itemData.product_name,
        target_price: itemData.target_price,
        user_email: itemData.user_email,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Alerts POST error:", error);
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
    }

    return NextResponse.json({ success: true, alert: data }, { status: 201 });
  } catch (err) {
    console.error("Alerts API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = patchSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { alert_id, ...updates } = validation.data;

    const { data, error } = await supabase
      .from('price_alerts')
      .update(updates)
      .eq('alert_id', alert_id)
      .eq('user_id', user.id) // Security check
      .select()
      .single();

    if (error) {
      console.error("Alerts PATCH error:", error);
      return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
    }

    return NextResponse.json({ success: true, alert: data });
  } catch (err) {
    console.error("Alerts API error:", err);
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
    const alert_id = searchParams.get('alert_id');
    
    const validation = deleteSchema.safeParse({ alert_id });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { error } = await supabase
      .from('price_alerts')
      .delete()
      .eq('alert_id', validation.data.alert_id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Alerts DELETE error:", error);
      return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Alerts API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
