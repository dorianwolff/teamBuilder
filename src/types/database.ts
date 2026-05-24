// Supabase table shapes for type-safe queries.
// Keep in sync with supabase/migrations/*.sql

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          elo: number
          games_played: number
          games_won: number
          games_lost: number
          win_streak: number
          best_win_streak: number
          unlocked_verses: string[]
          discovered_characters: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          elo?: number
          games_played?: number
          games_won?: number
          games_lost?: number
          win_streak?: number
          best_win_streak?: number
          unlocked_verses?: string[]
          discovered_characters?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      characters: {
        Row: {
          id: string
          slug: string
          name: string
          verse: string
          arc_version: string
          power_level: number
          martial_ratio: number
          power_tags: string[]
          strengths: Json
          weaknesses: Json
          cannot_win_against: string[]
          draw_conditions: Json
          image_path: string
          short_description: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          verse: string
          arc_version: string
          power_level: number
          martial_ratio?: number
          power_tags?: string[]
          strengths?: Json
          weaknesses?: Json
          cannot_win_against?: string[]
          draw_conditions?: Json
          image_path: string
          short_description?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['characters']['Row']>
      }
      power_tags: {
        Row: {
          id: string
          slug: string
          name: string
          color: string
          description: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          color?: string
          description?: string
        }
        Update: Partial<Database['public']['Tables']['power_tags']['Row']>
      }
      game_rooms: {
        Row: {
          id: string
          code: string
          mode: string
          verse: string
          status: string
          player_a_id: string
          player_b_id: string | null
          draft_state: Json | null
          battle_state: Json | null
          winner_id: string | null
          elo_delta_a: number | null
          elo_delta_b: number | null
          created_at: string
          started_at: string | null
          finished_at: string | null
        }
        Insert: {
          id?: string
          code: string
          mode: string
          verse: string
          status?: string
          player_a_id: string
          player_b_id?: string | null
          draft_state?: Json | null
          battle_state?: Json | null
          winner_id?: string | null
          elo_delta_a?: number | null
          elo_delta_b?: number | null
          created_at?: string
          started_at?: string | null
          finished_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['game_rooms']['Row']>
      }
      matchmaking_queue: {
        Row: {
          id: string
          user_id: string
          elo: number
          verse: string
          joined_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          elo: number
          verse: string
          joined_at?: string
          status?: string
        }
        Update: Partial<Database['public']['Tables']['matchmaking_queue']['Row']>
      }
    }
  }
}
