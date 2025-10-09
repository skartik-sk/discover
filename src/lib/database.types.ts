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
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean
          name: Database['public']['Enums']['project_category']
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: Database['public']['Enums']['project_category']
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: Database['public']['Enums']['project_category']
        }
      }
      nft_rewards: {
        Row: {
          chain_id: number
          contract_address: string
          created_at: string
          id: string
          minted_at: string
          project_id: string
          transaction_hash: string | null
          token_id: number | null
          user_id: string
        }
        Insert: {
          chain_id?: number
          contract_address: string
          created_at?: string
          id?: string
          minted_at?: string
          project_id: string
          transaction_hash?: string | null
          token_id?: number | null
          user_id: string
        }
        Update: {
          chain_id?: number
          contract_address?: string
          created_at?: string
          id?: string
          minted_at?: string
          project_id?: string
          transaction_hash?: string | null
          token_id?: number | null
          user_id?: string
        }
      }
      project_testers: {
        Row: {
          created_at: string
          feedback_received: boolean
          id: string
          project_id: string
          tested_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_received?: boolean
          id?: string
          project_id: string
          tested_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_received?: boolean
          id?: string
          project_id?: string
          tested_at?: string
          user_id?: string
        }
      }
      project_views: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          project_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          project_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          project_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
      }
      projects: {
        Row: {
          approved_at: string | null
          banner_url: string | null
          category_id: string | null
          created_at: string
          creator_id: string
          demo_url: string | null
          description: string
          discord_url: string | null
          github_url: string | null
          id: string
          is_featured: boolean
          featured_at: string | null
          long_description: string | null
          logo_url: string | null
          rejected_at: string | null
          rejection_reason: string | null
          slug: string
          status: Database['public']['Enums']['project_status']
          submitted_at: string | null
          tags: string[] | null
          tech_stack: string[] | null
          title: string
          telegram_url: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          approved_at?: string | null
          banner_url?: string | null
          category_id?: string | null
          created_at?: string
          creator_id: string
          demo_url?: string | null
          description: string
          discord_url?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean
          featured_at?: string | null
          long_description?: string | null
          logo_url?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          slug: string
          status?: Database['public']['Enums']['project_status']
          submitted_at?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          title: string
          telegram_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          approved_at?: string | null
          banner_url?: string | null
          category_id?: string | null
          created_at?: string
          creator_id?: string
          demo_url?: string | null
          description?: string
          discord_url?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean
          featured_at?: string | null
          long_description?: string | null
          logo_url?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          slug?: string
          status?: Database['public']['Enums']['project_status']
          submitted_at?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          title?: string
          telegram_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
      }
      reviews: {
        Row: {
          created_at: string
          helpful_count: number
          id: string
          is_tested: boolean
          project_id: string
          rating: number
          review_text: string | null
          status: Database['public']['Enums']['review_status']
          test_feedback: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful_count?: number
          id?: string
          is_tested?: boolean
          project_id: string
          rating: number
          review_text?: string | null
          status?: Database['public']['Enums']['review_status']
          test_feedback?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful_count?: number
          id?: string
          is_tested?: boolean
          project_id?: string
          rating?: number
          review_text?: string | null
          status?: Database['public']['Enums']['review_status']
          test_feedback?: string | null
          updated_at?: string
          user_id?: string
        }
      }
      users: {
        Row: {
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_active: boolean
          is_verified: boolean
          role: Database['public']['Enums']['user_role']
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          role?: Database['public']['Enums']['user_role']
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          role?: Database['public']['Enums']['user_role']
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
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
      project_category: 'defi' | 'nft' | 'gaming' | 'infrastructure' | 'dao' | 'education' | 'other'
      project_status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'featured'
      review_status: 'pending' | 'approved' | 'rejected'
      user_role: 'tester' | 'creator' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}