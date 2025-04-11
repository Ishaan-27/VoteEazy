export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          wallet_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          wallet_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          wallet_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      elections: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          status: 'upcoming' | 'active' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          status?: 'upcoming' | 'active' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: 'upcoming' | 'active' | 'completed'
          created_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          election_id: string
          name: string
          party: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          election_id: string
          name: string
          party: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          election_id?: string
          name?: string
          party?: string
          image_url?: string | null
          created_at?: string
        }
      }
    }
  }
}