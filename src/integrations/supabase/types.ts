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
      daily_challenges: {
        Row: {
          active: boolean | null
          challenge_type: string | null
          created_at: string | null
          date: string
          id: string
          reward_points: number | null
          subject: string | null
          target_value: number | null
        }
        Insert: {
          active?: boolean | null
          challenge_type?: string | null
          created_at?: string | null
          date: string
          id?: string
          reward_points?: number | null
          subject?: string | null
          target_value?: number | null
        }
        Update: {
          active?: boolean | null
          challenge_type?: string | null
          created_at?: string | null
          date?: string
          id?: string
          reward_points?: number | null
          subject?: string | null
          target_value?: number | null
        }
        Relationships: []
      }
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
          difficulty_level: number | null
          energy_state: string | null
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
          difficulty_level?: number | null
          energy_state?: string | null
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
          difficulty_level?: number | null
          energy_state?: string | null
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
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_public"
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
      revision_queue: {
        Row: {
          chapter: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          review_number: number | null
          scheduled_date: string
          subject: string
          topic: string
          user_id: string | null
        }
        Insert: {
          chapter: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          review_number?: number | null
          scheduled_date: string
          subject: string
          topic: string
          user_id?: string | null
        }
        Update: {
          chapter?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          review_number?: number | null
          scheduled_date?: string
          subject?: string
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          ai_metrics: Json | null
          completion_status: number | null
          created_at: string | null
          date: string | null
          id: string
          last_updated: string | null
          next_refresh_time: string | null
          performance: Json | null
          plan_type: string | null
          recommendations: Json | null
          study_goals: Json | null
          subjects: Json | null
          total_study_time: number | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          ai_metrics?: Json | null
          completion_status?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          last_updated?: string | null
          next_refresh_time?: string | null
          performance?: Json | null
          plan_type?: string | null
          recommendations?: Json | null
          study_goals?: Json | null
          subjects?: Json | null
          total_study_time?: number | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          ai_metrics?: Json | null
          completion_status?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          last_updated?: string | null
          next_refresh_time?: string | null
          performance?: Json | null
          plan_type?: string | null
          recommendations?: Json | null
          study_goals?: Json | null
          subjects?: Json | null
          total_study_time?: number | null
          user_id?: string | null
          version?: number | null
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
      topic_dependencies: {
        Row: {
          difficulty_multiplier: number | null
          id: string
          requires_topics: string[] | null
          subject: string
          topic: string
        }
        Insert: {
          difficulty_multiplier?: number | null
          id?: string
          requires_topics?: string[] | null
          subject: string
          topic: string
        }
        Update: {
          difficulty_multiplier?: number | null
          id?: string
          requires_topics?: string[] | null
          subject?: string
          topic?: string
        }
        Relationships: []
      }
      topic_mastery: {
        Row: {
          accuracy: number | null
          chapter: string
          created_at: string | null
          current_level: number | null
          id: string
          last_practiced: string | null
          mastery_date: string | null
          questions_attempted: number | null
          stuck_days: number | null
          subject: string
          topic: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          chapter: string
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_practiced?: string | null
          mastery_date?: string | null
          questions_attempted?: number | null
          stuck_days?: number | null
          subject: string
          topic: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          chapter?: string
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_practiced?: string | null
          mastery_date?: string | null
          questions_attempted?: number | null
          stuck_days?: number | null
          subject?: string
          topic?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_energy_logs: {
        Row: {
          accuracy: number | null
          auto_rest_suggested: boolean | null
          burnout_signals: string[] | null
          created_at: string | null
          date: string
          energy_score: number | null
          id: string
          questions_attempted: number | null
          study_hours: number | null
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          auto_rest_suggested?: boolean | null
          burnout_signals?: string[] | null
          created_at?: string | null
          date: string
          energy_score?: number | null
          id?: string
          questions_attempted?: number | null
          study_hours?: number | null
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          auto_rest_suggested?: boolean | null
          burnout_signals?: string[] | null
          created_at?: string | null
          date?: string
          energy_score?: number | null
          id?: string
          questions_attempted?: number | null
          study_hours?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_rankings: {
        Row: {
          accuracy: number | null
          cohort: string | null
          created_at: string | null
          date: string
          percentile: number | null
          questions_solved: number | null
          rank: number | null
          study_time_minutes: number | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          cohort?: string | null
          created_at?: string | null
          date: string
          percentile?: number | null
          questions_solved?: number | null
          rank?: number | null
          study_time_minutes?: number | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          cohort?: string | null
          created_at?: string | null
          date?: string
          percentile?: number | null
          questions_solved?: number | null
          rank?: number | null
          study_time_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      questions_public: {
        Row: {
          chapter: string | null
          created_at: string | null
          difficulty: string | null
          id: string | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          question: string | null
          subject: string | null
          topic: string | null
          year: number | null
        }
        Insert: {
          chapter?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question?: string | null
          subject?: string | null
          topic?: string | null
          year?: number | null
        }
        Update: {
          chapter?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          question?: string | null
          subject?: string | null
          topic?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_question_answer: {
        Args: {
          p_question_id: string
          p_selected_answer: string
          p_time_taken?: number
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
