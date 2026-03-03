-- ============================================================
-- AI Benchmarks Schema — Run in Supabase SQL Editor
-- ============================================================

DROP TABLE IF EXISTS ai_models    CASCADE;
DROP TABLE IF EXISTS pipeline_meta CASCADE;

CREATE TABLE ai_models (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE,
  provider         TEXT,
  color            TEXT,

  -- Performance (Artificial Analysis)
  intelligence     NUMERIC(8,2),
  coding           NUMERIC(8,2),
  math             NUMERIC(8,2),
  mmlu_pro         NUMERIC(6,4),
  gpqa             NUMERIC(6,4),
  hle              NUMERIC(6,4),
  aime             NUMERIC(6,4),
  livecodebench    NUMERIC(6,4),

  -- Speed
  output_speed     NUMERIC(8,2),
  latency          NUMERIC(8,3),

  -- Pricing (USD per 1M tokens)
  price_input      NUMERIC(10,4),
  price_output     NUMERIC(10,4),
  price_blended    NUMERIC(10,4),

  -- Computed
  value_score      NUMERIC(10,2),
  efficiency_tier  TEXT,
  is_best_value    BOOLEAN DEFAULT false,

  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pipeline_meta (
  id           TEXT PRIMARY KEY DEFAULT 'latest_run',
  ran_at       TIMESTAMPTZ NOT NULL,
  model_count  INTEGER NOT NULL,
  source       TEXT DEFAULT 'artificial_analysis+openrouter'
);

-- Indexes
CREATE INDEX idx_intelligence ON ai_models (intelligence DESC NULLS LAST);
CREATE INDEX idx_value        ON ai_models (value_score  DESC NULLS LAST);
CREATE INDEX idx_price        ON ai_models (price_blended ASC NULLS LAST);
CREATE INDEX idx_provider     ON ai_models (provider);
CREATE INDEX idx_best_value   ON ai_models (is_best_value) WHERE is_best_value = true;

-- RLS
ALTER TABLE ai_models     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ai_models"
  ON ai_models FOR SELECT TO anon USING (true);
CREATE POLICY "Public read pipeline_meta"
  ON pipeline_meta FOR SELECT TO anon USING (true);
