import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const createClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}