export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversation_history: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          session_id: string | null
          timestamp: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          session_id?: string | null
          timestamp: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "tutor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      course_content: {
        Row: {
          article_link: string | null
          course_id: number | null
          id: number
          notes: string
          title: string
          video_url: string
        }
        Insert: {
          article_link?: string | null
          course_id?: number | null
          id?: number
          notes: string
          title: string
          video_url: string
        }
        Update: {
          article_link?: string | null
          course_id?: number | null
          id?: number
          notes?: string
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          difficulty_level:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration: number
          id: number
          instructor_id: string | null
          level: string
          price: number | null
          tavus_replica_id: string | null
          thumbnail_url: string | null
          title: string
          voice_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          difficulty_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration: number
          id?: number
          instructor_id?: string | null
          level: string
          price?: number | null
          tavus_replica_id?: string | null
          thumbnail_url?: string | null
          title: string
          voice_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          difficulty_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          duration?: number
          id?: number
          instructor_id?: string | null
          level?: string
          price?: number | null
          tavus_replica_id?: string | null
          thumbnail_url?: string | null
          title?: string
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: number | null
          created_at: string | null
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          accuracy: number
          created_at: string
          game_type: string
          id: string
          level: number
          particles_cut: number
          particles_missed: number
          score: number
          time_taken: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number
          created_at?: string
          game_type: string
          id?: string
          level: number
          particles_cut?: number
          particles_missed?: number
          score?: number
          time_taken?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number
          created_at?: string
          game_type?: string
          id?: string
          level?: number
          particles_cut?: number
          particles_missed?: number
          score?: number
          time_taken?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          course_id: number | null
          created_at: string | null
          duration: number | null
          id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id?: number | null
          created_at?: string | null
          duration?: number | null
          id?: string
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: number | null
          created_at?: string | null
          duration?: number | null
          id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_certificates: {
        Row: {
          algorand_asset_id: string | null
          course_id: number | null
          id: string
          metadata: Json | null
          minted_at: string | null
          user_id: string | null
        }
        Insert: {
          algorand_asset_id?: string | null
          course_id?: number | null
          id?: string
          metadata?: Json | null
          minted_at?: string | null
          user_id?: string | null
        }
        Update: {
          algorand_asset_id?: string | null
          course_id?: number | null
          id?: string
          metadata?: Json | null
          minted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_paid: number
          created_at: string
          id: string
          payment_id: string | null
          status: string
          upi_reference: string | null
          user_id: string
          valid_until: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          id?: string
          payment_id?: string | null
          status: string
          upi_reference?: string | null
          user_id: string
          valid_until: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: string
          upi_reference?: string | null
          user_id?: string
          valid_until?: string
        }
        Relationships: []
      }
      tutor_sessions: {
        Row: {
          conversation_summary: string | null
          course_id: number | null
          created_at: string | null
          ended_at: string | null
          id: string
          lesson_id: string | null
          persona_id: string
          replica_id: string
          started_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          conversation_summary?: string | null
          course_id?: number | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          persona_id: string
          replica_id: string
          started_at?: string
          status: string
          user_id?: string | null
        }
        Update: {
          conversation_summary?: string | null
          course_id?: number | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          lesson_id?: string | null
          persona_id?: string
          replica_id?: string
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_voice_preferences: {
        Row: {
          accessibility_mode: boolean
          auto_play: boolean
          created_at: string
          hands_free_mode: boolean
          id: string
          noise_cancellation: boolean
          preferred_voice_id: string
          selected_language: string
          selected_persona: string
          speech_speed: number
          updated_at: string
          user_id: string
          volume: number
        }
        Insert: {
          accessibility_mode?: boolean
          auto_play?: boolean
          created_at?: string
          hands_free_mode?: boolean
          id?: string
          noise_cancellation?: boolean
          preferred_voice_id?: string
          selected_language?: string
          selected_persona?: string
          speech_speed?: number
          updated_at?: string
          user_id: string
          volume?: number
        }
        Update: {
          accessibility_mode?: boolean
          auto_play?: boolean
          created_at?: string
          hands_free_mode?: boolean
          id?: string
          noise_cancellation?: boolean
          preferred_voice_id?: string
          selected_language?: string
          selected_persona?: string
          speech_speed?: number
          updated_at?: string
          user_id?: string
          volume?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_enrollment_progress: {
        Args: { p_user_id: string; p_course_id: number; p_progress: number }
        Returns: undefined
      }
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      interaction_type:
        | "course_view"
        | "lesson_complete"
        | "certificate_mint"
        | "chat_message"
      prompt_type:
        | "reading_passage"
        | "listening_script"
        | "writing_prompt"
        | "speaking_prompt"
      section_type: "reading" | "writing" | "speaking" | "listening"
      subscription_tier: "free" | "premium" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_level: ["beginner", "intermediate", "advanced"],
      interaction_type: [
        "course_view",
        "lesson_complete",
        "certificate_mint",
        "chat_message",
      ],
      prompt_type: [
        "reading_passage",
        "listening_script",
        "writing_prompt",
        "speaking_prompt",
      ],
      section_type: ["reading", "writing", "speaking", "listening"],
      subscription_tier: ["free", "premium", "pro"],
    },
  },
} as const
