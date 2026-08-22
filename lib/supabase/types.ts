// Supabase Database Types
// Generated manually — run `npx supabase gen types typescript` after connecting your project

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "jane" | "josh";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: "jane" | "josh";
          display_name: string;
          avatar_emoji: string;
          bio: string | null;
          is_online: boolean;
          last_seen: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      letters: {
        Row: {
          id: string;
          sender: string;
          recipient: string;
          title: string | null;
          body: string;
          mood: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["letters"]["Row"], "id" | "created_at" | "is_read" | "read_at">;
        Update: Partial<Pick<Database["public"]["Tables"]["letters"]["Row"], "is_read" | "read_at">>;
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          url: string | null;
          added_by: string;
          reason: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["songs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["songs"]["Insert"]>;
      };
      memories: {
        Row: {
          id: string;
          title: string;
          image_url: string | null;
          description: string | null;
          memory_date: string | null;
          creator: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["memories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["memories"]["Insert"]>;
      };
      daily_questions: {
        Row: {
          id: string;
          question: string;
          question_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_questions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["daily_questions"]["Insert"]>;
      };
      daily_answers: {
        Row: {
          id: string;
          question_id: string;
          user_id: string;
          answer: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_answers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["daily_answers"]["Insert"]>;
      };
      moods: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["moods"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["moods"]["Insert"]>;
      };
      surprises: {
        Row: {
          id: string;
          from_user: string;
          to_user: string;
          content_type: "text" | "song" | "image" | "joke";
          content: string;
          title: string | null;
          is_opened: boolean;
          opened_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["surprises"]["Row"], "id" | "created_at" | "is_opened" | "opened_at">;
        Update: Partial<Pick<Database["public"]["Tables"]["surprises"]["Row"], "is_opened" | "opened_at">>;
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_key: string;
          earned_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["achievements"]["Row"], "id" | "earned_at">;
        Update: never;
      };
      pet: {
        Row: {
          id: string;
          name: string;
          hunger: number;
          happiness: number;
          last_fed_by: string | null;
          last_played_by: string | null;
          last_fed_at: string | null;
          last_played_at: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pet"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["pet"]["Insert"]>;
      };
      pet_actions: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          action: "feed" | "pet" | "play";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pet_actions"]["Row"], "id" | "created_at">;
        Update: never;
      };
      reactions: {
        Row: {
          id: string;
          target_type: string;
          target_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reactions"]["Row"], "id" | "created_at">;
        Update: never;
      };
      jane_lore: {
        Row: {
          id: string;
          category: string;
          key: string;
          value: string;
          emoji: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["jane_lore"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["jane_lore"]["Insert"]>;
      };
      quiz_questions: {
        Row: {
          id: string;
          question: string;
          options: string[];
          correct_index: number;
          hint: string | null;
          creator?: string | null;
          target?: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["quiz_questions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Insert"]>;
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Letter = Database["public"]["Tables"]["letters"]["Row"];
export type Song = Database["public"]["Tables"]["songs"]["Row"];
export type Memory = Database["public"]["Tables"]["memories"]["Row"];
export type DailyQuestion = Database["public"]["Tables"]["daily_questions"]["Row"];
export type DailyAnswer = Database["public"]["Tables"]["daily_answers"]["Row"];
export type Mood = Database["public"]["Tables"]["moods"]["Row"];
export type Surprise = Database["public"]["Tables"]["surprises"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type Pet = Database["public"]["Tables"]["pet"]["Row"];
export type PetAction = Database["public"]["Tables"]["pet_actions"]["Row"];
export type JaneLore = Database["public"]["Tables"]["jane_lore"]["Row"];
export type QuizQuestion = Database["public"]["Tables"]["quiz_questions"]["Row"];
