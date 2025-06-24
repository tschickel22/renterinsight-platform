import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          source: string
          source_id: string | null
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          assigned_to: string | null
          notes: string
          score: number
          last_activity: string
          custom_fields: Record<string, any>
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          source: string
          source_id?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          assigned_to?: string | null
          notes?: string
          score?: number
          last_activity?: string
          custom_fields?: Record<string, any>
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          source?: string
          source_id?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          assigned_to?: string | null
          notes?: string
          score?: number
          last_activity?: string
          custom_fields?: Record<string, any>
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      lead_sources: {
        Row: {
          id: string
          name: string
          type: string
          is_active: boolean
          tracking_code: string | null
          conversion_rate: number
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          is_active?: boolean
          tracking_code?: string | null
          conversion_rate?: number
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          is_active?: boolean
          tracking_code?: string | null
          conversion_rate?: number
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      sales_reps: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          territory: string | null
          is_active: boolean
          monthly_target: number
          quarterly_target: number
          annual_target: number
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          territory?: string | null
          is_active?: boolean
          monthly_target?: number
          quarterly_target?: number
          annual_target?: number
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          territory?: string | null
          is_active?: boolean
          monthly_target?: number
          quarterly_target?: number
          annual_target?: number
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          type: string
          description: string
          outcome: string | null
          duration: number | null
          scheduled_date: string | null
          completed_date: string
          user_id: string
          metadata: Record<string, any>
          tenant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          type: string
          description: string
          outcome?: string | null
          duration?: number | null
          scheduled_date?: string | null
          completed_date?: string
          user_id: string
          metadata?: Record<string, any>
          tenant_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          type?: string
          description?: string
          outcome?: string | null
          duration?: number | null
          scheduled_date?: string | null
          completed_date?: string
          user_id?: string
          metadata?: Record<string, any>
          tenant_id?: string
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          vin: string
          make: string
          model: string
          year: number
          type: 'rv' | 'motorhome' | 'travel_trailer' | 'fifth_wheel' | 'toy_hauler'
          status: 'available' | 'reserved' | 'sold' | 'service' | 'delivered'
          price: number
          cost: number
          location: string | null
          features: string[]
          images: string[]
          custom_fields: Record<string, any>
          tenant_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vin: string
          make: string
          model: string
          year: number
          type: 'rv' | 'motorhome' | 'travel_trailer' | 'fifth_wheel' | 'toy_hauler'
          status?: 'available' | 'reserved' | 'sold' | 'service' | 'delivered'
          price: number
          cost: number
          location?: string | null
          features?: string[]
          images?: string[]
          custom_fields?: Record<string, any>
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vin?: string
          make?: string
          model?: string
          year?: number
          type?: 'rv' | 'motorhome' | 'travel_trailer' | 'fifth_wheel' | 'toy_hauler'
          status?: 'available' | 'reserved' | 'sold' | 'service' | 'delivered'
          price?: number
          cost?: number
          location?: string | null
          features?: string[]
          images?: string[]
          custom_fields?: Record<string, any>
          tenant_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}