import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { z } from 'zod';

const deleteSchema = z.object({
  search_id: z.string().min(1, "search_id is required")
});

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error("History GET error:", error);
      return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 });
    }

    return NextResponse.json({ history: data });
  } catch (err) {
    console.error("History API error:", err);
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
    const search_id = searchParams.get('search_id');
    const clear_all = searchParams.get('clear_all') === 'true';

    // Support for clearing entire history
    if (clear_all) {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error("History clear all error:", error);
        return NextResponse.json({ error: "Failed to clear history" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "All history cleared" });
    }

    // Otherwise, validate search_id and delete specific item
    const validation = deleteSchema.safeParse({ search_id });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('search_id', validation.data.search_id)
      .eq('user_id', user.id); // Strict ownership check

    if (error) {
      console.error("History DELETE error:", error);
      return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("History API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
