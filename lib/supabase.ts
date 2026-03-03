import { createClient } from "@supabase/supabase-js";
import type { AIModel, PipelineMeta } from "./types";

export type { AIModel, PipelineMeta };

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row:    AIModel;
        Insert: Omit<AIModel, "updated_at"> & { updated_at?: string };
        Update: Partial<AIModel>;
      };
      pipeline_meta: {
        Row:    PipelineMeta & { id: string };
        Insert: PipelineMeta & { id: string };
        Update: Partial<PipelineMeta>;
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
};

export function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
