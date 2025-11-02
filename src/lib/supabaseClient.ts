import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Optional: public site URL for auth redirects (e.g., your Vercel domain)
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || ''

export const SUPABASE_CONFIGURED: boolean = !!(url && anon)

export const supabase: SupabaseClient | null = SUPABASE_CONFIGURED
  ? createClient(url as string, anon as string)
  : null
