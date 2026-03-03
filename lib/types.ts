export interface AIModel {
  // identifiers
  id:               string;   // Artificial Analysis ID
  name:             string;
  slug:             string;
  provider:         string;
  color:            string;

  // performance (Artificial Analysis)
  intelligence:     number | null;  // Overall Intelligence Index
  coding:           number | null;  // Coding Index
  math:             number | null;  // Math Index
  mmlu_pro:         number | null;
  gpqa:             number | null;
  hle:              number | null;
  aime:             number | null;
  livecodebench:    number | null;

  // speed (Artificial Analysis)
  output_speed:     number | null;  // tokens/sec
  latency:          number | null;  // seconds to first token

  // pricing (OpenRouter, USD per 1M tokens)
  price_input:      number | null;
  price_output:     number | null;
  price_blended:    number | null;  // (input*3 + output) / 4

  // computed
  value_score:      number | null;  // intelligence / price_blended
  efficiency_tier:  "exceptional" | "great" | "good" | "fair" | "premium" | "free" | "unknown";
  is_best_value:    boolean;

  updated_at:       string;
}

export interface PipelineMeta {
  ran_at:      string;
  model_count: number;
  source:      string;
}

export type SortKey = "intelligence" | "value_score" | "price_blended" | "output_speed" | "coding" | "math";
export type Category = "intelligence" | "coding" | "math";
