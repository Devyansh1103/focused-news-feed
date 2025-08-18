import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          category: string
          source: string | null
          author: string | null
          url: string | null
          image_url: string | null
          published_at: string | null
          read_time: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          content?: string | null
          category: string
          source?: string | null
          author?: string | null
          url?: string | null
          image_url?: string | null
          published_at?: string | null
          read_time?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          content?: string | null
          category?: string
          source?: string | null
          author?: string | null
          url?: string | null
          image_url?: string | null
          published_at?: string | null
          read_time?: number | null
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          article_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          article_id: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      reading_history: {
        Row: {
          id: string
          user_id: string
          article_id: string
          read_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          read_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          read_at?: string
        }
      }
    }
  }
}