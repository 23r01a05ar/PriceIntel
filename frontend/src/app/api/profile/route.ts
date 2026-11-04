import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { z } from 'zod';

const patchSchema = z.object({
  username: z.string().max(80).optional(),
  full_name: z.string().max(150).optional(),
  whatsapp_no: z.string().max(20).optional(),
  twitter_handle: z.string().max(100).optional(),
  facebook_url: z.string().url("Invalid Facebook URL").max(255).optional().or(z.literal('')),
  instagram_url: z.string().url("Invalid Instagram URL").max(255).optional().or(z.literal(''))
});

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found yet, which is expected for new users without triggers
        return NextResponse.json({ profile: null }, { status: 200 });
      }
      console.error("Profile GET error:", error);
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error("Profile API error:", err);
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

    const updates = validation.data;

    // Use upsert so that if the profile doesn't exist yet, it&apos;s created
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...updates
      })
      .select()
      .single();

    if (error) {
      console.error("Profile PATCH error:", error);
      
      // PostgreSQL error 42703 is undefined_column
      if (error.code === '42703' || error.message?.includes('Could not find')) {
        return NextResponse.json(
          { error: "Profile schema migration has not been applied. Please run the required database migration." }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("Profile API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
