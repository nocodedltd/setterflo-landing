// Database types for SetterFlo
// After running migrations, generate types with:
// npx supabase gen types typescript --project-id your-project-ref > lib/types/database.ts

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
          email: string | null
          phone: string | null
          timezone: string | null
          business_name: string | null
          website: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          timezone?: string | null
          business_name?: string | null
          website?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          timezone?: string | null
          business_name?: string | null
          website?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      instagram_accounts: {
        Row: {
          id: string
          user_id: string
          handle: string
          instagram_user_id: string | null
          access_token: string | null
          status: string
          is_listening: boolean
          connected_at: string
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          handle: string
          instagram_user_id?: string | null
          access_token?: string | null
          status?: string
          is_listening?: boolean
          connected_at?: string
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          handle?: string
          instagram_user_id?: string | null
          access_token?: string | null
          status?: string
          is_listening?: boolean
          connected_at?: string
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          instagram_account_id: string | null
          name: string | null
          handle: string
          instagram_user_id: string | null
          avatar_url: string | null
          location: string | null
          role: string | null
          bio: string | null
          follower_count: number | null
          status: string
          stage: string
          score: number
          source: string | null
          campaign_id: string | null
          first_contact_at: string | null
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instagram_account_id?: string | null
          name?: string | null
          handle: string
          instagram_user_id?: string | null
          avatar_url?: string | null
          location?: string | null
          role?: string | null
          bio?: string | null
          follower_count?: number | null
          status?: string
          stage?: string
          score?: number
          source?: string | null
          campaign_id?: string | null
          first_contact_at?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          instagram_account_id?: string | null
          name?: string | null
          handle?: string
          instagram_user_id?: string | null
          avatar_url?: string | null
          location?: string | null
          role?: string | null
          bio?: string | null
          follower_count?: number | null
          status?: string
          stage?: string
          score?: number
          source?: string | null
          campaign_id?: string | null
          first_contact_at?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          instagram_account_id: string | null
          status: string
          unread_count: number
          ai_enabled: boolean
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id: string
          instagram_account_id?: string | null
          status?: string
          unread_count?: number
          ai_enabled?: boolean
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string
          instagram_account_id?: string | null
          status?: string
          unread_count?: number
          ai_enabled?: boolean
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          lead_id: string
          text: string
          sender: 'ai' | 'user' | 'lead'
          message_type: string
          instagram_message_id: string | null
          is_read: boolean
          generated_by_ai: boolean
          ai_confidence: number | null
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          lead_id: string
          text: string
          sender: 'ai' | 'user' | 'lead'
          message_type?: string
          instagram_message_id?: string | null
          is_read?: boolean
          generated_by_ai?: boolean
          ai_confidence?: number | null
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          lead_id?: string
          text?: string
          sender?: 'ai' | 'user' | 'lead'
          message_type?: string
          instagram_message_id?: string | null
          is_read?: boolean
          generated_by_ai?: boolean
          ai_confidence?: number | null
          sent_at?: string
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          instagram_account_id: string | null
          name: string
          status: string
          target: string | null
          target_count: string | null
          sent: number
          total: number
          responses: number
          qualified: number
          booked: number
          daily_limit: number
          message_template: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instagram_account_id?: string | null
          name: string
          status?: string
          target?: string | null
          target_count?: string | null
          sent?: number
          total: number
          responses?: number
          qualified?: number
          booked?: number
          daily_limit?: number
          message_template?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          instagram_account_id?: string | null
          name?: string
          status?: string
          target?: string | null
          target_count?: string | null
          sent?: number
          total?: number
          responses?: number
          qualified?: number
          booked?: number
          daily_limit?: number
          message_template?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          status: string
          n8n_workflow_id: string | null
          n8n_webhook_url: string | null
          last_run_at: string | null
          executions_today: number
          error_count: number
          health_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          status?: string
          n8n_workflow_id?: string | null
          n8n_webhook_url?: string | null
          last_run_at?: string | null
          executions_today?: number
          error_count?: number
          health_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          status?: string
          n8n_workflow_id?: string | null
          n8n_webhook_url?: string | null
          last_run_at?: string | null
          executions_today?: number
          error_count?: number
          health_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          type: string
          content: string
          target: string | null
          lead_id: string | null
          campaign_id: string | null
          conversation_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          content: string
          target?: string | null
          lead_id?: string | null
          campaign_id?: string | null
          conversation_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          content?: string
          target?: string | null
          lead_id?: string | null
          campaign_id?: string | null
          conversation_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      ai_settings: {
        Row: {
          id: string
          user_id: string
          tone: string
          formality_level: number
          emoji_usage: boolean
          turn_off_after_booking: boolean
          send_calendar_reminders: boolean
          response_delay_min: number
          response_delay_max: number
          batch_messages: boolean
          handle_too_expensive: boolean
          handle_need_to_think: boolean
          handle_already_have_coach: boolean
          handle_send_info: boolean
          custom_rules: Json
          blacklisted_usernames: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tone?: string
          formality_level?: number
          emoji_usage?: boolean
          turn_off_after_booking?: boolean
          send_calendar_reminders?: boolean
          response_delay_min?: number
          response_delay_max?: number
          batch_messages?: boolean
          handle_too_expensive?: boolean
          handle_need_to_think?: boolean
          handle_already_have_coach?: boolean
          handle_send_info?: boolean
          custom_rules?: Json
          blacklisted_usernames?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tone?: string
          formality_level?: number
          emoji_usage?: boolean
          turn_off_after_booking?: boolean
          send_calendar_reminders?: boolean
          response_delay_min?: number
          response_delay_max?: number
          batch_messages?: boolean
          handle_too_expensive?: boolean
          handle_need_to_think?: boolean
          handle_already_have_coach?: boolean
          handle_send_info?: boolean
          custom_rules?: Json
          blacklisted_usernames?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          conversation_id: string | null
          scheduled_at: string
          duration_minutes: number
          status: string
          calendar_event_id: string | null
          calendar_link: string | null
          meeting_type: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id: string
          conversation_id?: string | null
          scheduled_at: string
          duration_minutes?: number
          status?: string
          calendar_event_id?: string | null
          calendar_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lead_id?: string
          conversation_id?: string | null
          scheduled_at?: string
          duration_minutes?: number
          status?: string
          calendar_event_id?: string | null
          calendar_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          status: string
          credentials: Json | null
          settings: Json
          connected_at: string | null
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          status?: string
          credentials?: Json | null
          settings?: Json
          connected_at?: string | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          status?: string
          credentials?: Json | null
          settings?: Json
          connected_at?: string | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      pipeline_stats: {
        Row: {
          user_id: string | null
          stage: string | null
          count: number | null
        }
      }
      campaign_performance: {
        Row: {
          id: string | null
          user_id: string | null
          instagram_account_id: string | null
          name: string | null
          status: string | null
          target: string | null
          target_count: string | null
          sent: number | null
          total: number | null
          responses: number | null
          qualified: number | null
          booked: number | null
          daily_limit: number | null
          message_template: string | null
          start_date: string | null
          end_date: string | null
          response_rate: number | null
          qualification_rate: number | null
          booking_rate: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}



