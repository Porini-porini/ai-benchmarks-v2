/**
 * lib/api.ts
 * ──────────────────────────────────────────────────────────
 * Single source of truth for model data on the frontend.
 * Server components call getModels() — it reads from Supabase.
 * The Python pipeline (scripts/collect_data.py) populates
 * Supabase by merging Artificial Analysis + OpenRouter data.
 */

import { getSupabaseClient } from "./supabase";
import type { AIModel, SortKey } from "./types";

export type { AIModel };

// ── provider color map ────────────────────────────────────
export const PROVIDER_COLORS: Record<string, string> = {
  OpenAI:         "#10A37F",
  Anthropic:      "#C97B63",
  Google:         "#4285F4",
  Meta:           "#0668E1",
  "Mistral AI":   "#FF7000",
  xAI:            "#1DA1F2",
  DeepSeek:       "#5B6EF5",
  Alibaba:        "#FF6A00",
  Amazon:         "#FF9900",
  NVIDIA:         "#76B900",
  Cohere:         "#39594D",
};

export function getProviderColor(provider: string): string {
  return PROVIDER_COLORS[provider] ?? "#94A3B8";
}

// ── efficiency tier labels ────────────────────────────────
export const TIER_META: Record<string, { label: string; color: string; emoji: string }> = {
  exceptional: { label: "Exceptional Value", color: "#059669", emoji: "🚀" },
  great:       { label: "Great Value",        color: "#2563EB", emoji: "⭐" },
  good:        { label: "Good Value",         color: "#7C3AED", emoji: "✅" },
  fair:        { label: "Fair Value",         color: "#D97706", emoji: "👍" },
  premium:     { label: "Premium",            color: "#DC2626", emoji: "💎" },
  free:        { label: "Free",               color: "#0891B2", emoji: "🆓" },
  unknown:     { label: "No Pricing",         color: "#94A3B8", emoji: "❓" },
};

// ── fetch all models ──────────────────────────────────────
export async function getModels(opts?: {
  sort?:   SortKey;
  limit?:  number;
  search?: string;
}): Promise<AIModel[]> {
  const { sort = "intelligence", limit = 200, search } = opts ?? {};

  const supabase = getSupabaseClient();

  let query = supabase
    .from("ai_models")
    .select("*")
    .limit(limit);

  if (search) query = query.ilike("name", `%${search}%`);

  const ascending = sort === "price_blended";
  query = query.order(sort, { ascending, nullsFirst: false });

  const { data, error } = await query;

  if (error) {
    console.error("[api] Supabase error:", error.message);
    return [];
  }

  return (data ?? []) as AIModel[];
}

// ── fetch single model ────────────────────────────────────
export async function getModel(slug: string): Promise<AIModel | null> {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("ai_models")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as AIModel | null) ?? null;
}

// ── fetch pipeline meta ───────────────────────────────────
export async function getPipelineMeta() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("pipeline_meta")
    .select("*")
    .eq("id", "latest_run")
    .maybeSingle();
  return data as { ran_at: string; model_count: number; source: string } | null;
}

// ── helpers ───────────────────────────────────────────────
export function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price === 0)    return "Free";
  if (price < 0.01)   return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

export function formatScore(score: number | null, decimals = 1): string {
  if (score === null) return "—";
  return score.toFixed(decimals);
}

export function formatSpeed(tps: number | null): string {
  if (tps === null) return "—";
  return `${Math.round(tps)} t/s`;
}
