import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client configured for the browser (Client Components).
 * Uses environment variables securely without leaking them to the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Global instance for simple client-side usage across standard React components
export const supabase = createClient()
