export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string | null
          daily_goal: number | null
          email: string
          full_name: string | null
          goals_set: boolean | null
          grade: number | null
          id: string
          mobile_verified: boolean | null
          mobile_verified_at: string | null
          phone: string | null
          state: string | null
          subjects: string[] | null
          target_exam: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          daily_goal?: number | null
          email: string
          full_name?: string | null
          goals_set?: boolean | null
          grade?: number | null
          id: string
          mobile_verified?: boolean | null
          mobile_verified_at?: string | null
          phone?: string | null
          state?: string | null
          subjects?: string[] | null
          target_exam?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          daily_goal?: number | null
          email?: string
          full_name?: string | null
          goals_set?: boolean | null
          grade?: number | null
          id?: string
          mobile_verified?: boolean | null
          mobile_verified_at?: string | null
          phone?: string | null
          state?: string | null
          subjects?: string[] | null
          target_exam?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          attempted_at: string | null
          created_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          selected_option: string
          time_taken: number | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          created_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          selected_option: string
          time_taken?: number | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_option?: string
          time_taken?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          chapter: string
          correct_option: string
          created_at: string | null
          difficulty: string
          explanation: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          subject: string
          topic: string
          year: number | null
        }
        Insert: {
          chapter: string
          correct_option: string
          created_at?: string | null
          difficulty: string
          explanation?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          subject: string
          topic: string
          year?: number | null
        }
        Update: {
          chapter?: string
          correct_option?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          subject?: string
          topic?: string
          year?: number | null
        }
        Relationships: []
      }
      test_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number
          created_at: string | null
          id: string
          score: number | null
          started_at: string | null
          subject: string
          total_questions: number
          total_time: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_answers: number
          created_at?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          subject: string
          total_questions: number
          total_time?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number
          created_at?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          subject?: string
          total_questions?: number
          total_time?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          daily_streak: number | null
          id: string
          last_activity_date: string | null
          rank_position: number | null
          total_points: number | null
          total_questions_answered: number | null
          total_study_time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          daily_streak?: number | null
          id?: string
          last_activity_date?: string | null
          rank_position?: number | null
          total_points?: number | null
          total_questions_answered?: number | null
          total_study_time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          daily_streak?: number | null
          id?: string
          last_activity_date?: string | null
          rank_position?: number | null
          total_points?: number | null
          total_questions_answered?: number | null
          total_study_time?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
