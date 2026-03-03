"""
AI Benchmarks Data Pipeline
============================
Artificial Analysis API (performance) + OpenRouter API (pricing)
→ Supabase ai_models table

Required env vars:
  ARTIFICIAL_ANALYSIS_API_KEY
  SUPABASE_URL
  SUPABASE_SERVICE_KEY
"""

import os, re, json, time, logging
from datetime import datetime, timezone
from typing import Optional
import requests
from rapidfuzz import process, fuzz
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

AA_URL = "https://artificialanalysis.ai/api/v2/data/llms/models"
OR_URL = "https://openrouter.ai/api/v1/models"

# ── Provider color map ────────────────────────────────────────────────────────
PROVIDER_COLORS = {
    "OpenAI":       "#10A37F",
    "Anthropic":    "#C97B63",
    "Google":       "#4285F4",
    "Meta":         "#0668E1",
    "Mistral AI":   "#FF7000",
    "xAI":          "#1DA1F2",
    "DeepSeek":     "#5B6EF5",
    "Alibaba":      "#FF6A00",
    "Amazon":       "#FF9900",
    "NVIDIA":       "#76B900",
    "Cohere":       "#39594D",
}

# ── Efficiency tier ───────────────────────────────────────────────────────────
def calc_tier(value: Optional[float], is_free: bool) -> str:
    if is_free:       return "free"
    if value is None: return "unknown"
    if value > 800:   return "exceptional"
    if value > 400:   return "great"
    if value > 200:   return "good"
    if value > 100:   return "fair"
    return "premium"


# ── Step 1: Fetch Artificial Analysis ─────────────────────────────────────────
def fetch_aa() -> list[dict]:
    api_key = os.environ["ARTIFICIAL_ANALYSIS_API_KEY"]
    log.info("Fetching Artificial Analysis API...")
    res = requests.get(AA_URL, headers={"x-api-key": api_key, "User-Agent": "AIBenchmarksBot/1.0"}, timeout=30)
    res.raise_for_status()
    data = res.json().get("data", [])
    log.info(f"  ✓ {len(data)} models")
    return data


# ── Step 2: Fetch OpenRouter pricing ─────────────────────────────────────────
def fetch_openrouter() -> dict[str, dict]:
    log.info("Fetching OpenRouter pricing...")
    headers = {"User-Agent": "AIBenchmarksBot/1.0"}
    if key := os.getenv("OPENROUTER_API_KEY"):
        headers["Authorization"] = f"Bearer {key}"
    res = requests.get(OR_URL, headers=headers, timeout=30)
    res.raise_for_status()
    pricing: dict[str, dict] = {}
    for m in res.json().get("data", []):
        mid = m.get("id", "")
        p   = m.get("pricing", {})
        try:
            inp = float(p.get("prompt", 0) or 0) * 1_000_000
            out = float(p.get("completion", 0) or 0) * 1_000_000
            pricing[mid] = {
                "input":   round(inp, 4),
                "output":  round(out, 4),
                "context": m.get("context_length", 0),
            }
        except (ValueError, TypeError):
            continue
    log.info(f"  ✓ {len(pricing)} models")
    return pricing


# ── Step 3: Match & merge ─────────────────────────────────────────────────────
def normalize(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[-_/.]", " ", s)
    s = re.sub(r"\s+(instruct|chat|preview|latest|exp|beta|it)$", "", s)
    return re.sub(r"\s+", " ", s).strip()


def merge(aa_models: list[dict], or_pricing: dict[str, dict]) -> list[dict]:
    log.info("Merging datasets...")
    or_ids   = list(or_pricing.keys())
    or_norms = {normalize(mid): mid for mid in or_ids}
    records  = []

    for m in aa_models:
        creator = m.get("model_creator") or {}
        ev      = m.get("evaluations")   or {}
        p_raw   = m.get("pricing")       or {}

        # Try to find OpenRouter pricing
        aa_slug   = m.get("slug", "")
        or_match  = None

        # 1. Direct slug match
        for oid in or_ids:
            if aa_slug and aa_slug in oid:
                or_match = oid; break

        # 2. Fuzzy match
        if not or_match:
            hit = process.extractOne(normalize(aa_slug or m["name"]), list(or_norms.keys()),
                                     scorer=fuzz.token_sort_ratio, score_cutoff=72)
            if hit:
                or_match = or_norms[hit[0]]

        or_data = or_pricing.get(or_match) if or_match else None

        # Pricing — prefer AA pricing, fallback to OpenRouter
        price_in  = float(p_raw.get("price_1m_input_tokens")  or 0)
        price_out = float(p_raw.get("price_1m_output_tokens") or 0)
        if price_in == 0 and or_data:
            price_in  = or_data["input"]
            price_out = or_data["output"]

        blended   = float(p_raw.get("price_1m_blended_3_to_1") or 0)
        if blended == 0 and (price_in or price_out):
            blended = round((price_in * 3 + price_out) / 4, 4)

        intel = ev.get("artificial_analysis_intelligence_index")
        is_free = price_in == 0 and price_out == 0

        value_score: Optional[float] = None
        if intel is not None:
            if is_free:
                value_score = 9999.0
            elif blended > 0:
                value_score = round(intel / blended, 2)

        provider = creator.get("name", "Unknown")
        color    = PROVIDER_COLORS.get(provider, "#94A3B8")

        records.append({
            "id":              m["id"],
            "name":            m["name"],
            "slug":            m.get("slug") or re.sub(r"[^a-z0-9]+", "-", m["name"].lower()).strip("-"),
            "provider":        provider,
            "color":           color,

            "intelligence":    intel,
            "coding":          ev.get("artificial_analysis_coding_index"),
            "math":            ev.get("artificial_analysis_math_index"),
            "mmlu_pro":        ev.get("mmlu_pro"),
            "gpqa":            ev.get("gpqa"),
            "hle":             ev.get("hle"),
            "aime":            ev.get("aime"),
            "livecodebench":   ev.get("livecodebench"),

            "output_speed":    m.get("median_output_tokens_per_second"),
            "latency":         m.get("median_time_to_first_token_seconds"),

            "price_input":     price_in  or None,
            "price_output":    price_out or None,
            "price_blended":   blended   or None,

            "value_score":     value_score,
            "efficiency_tier": calc_tier(value_score, is_free),
            "is_best_value":   False,  # set below

            "updated_at":      datetime.now(timezone.utc).isoformat(),
        })

    # Mark best value: top 20% by value_score among paid models
    valued = sorted(
        [r for r in records if r["value_score"] and r["value_score"] < 9999],
        key=lambda x: x["value_score"], reverse=True
    )
    top_n = max(3, len(valued) // 5)
    best_ids = {r["id"] for r in valued[:top_n]}
    for r in records:
        r["is_best_value"] = r["id"] in best_ids

    # Sort by intelligence desc
    records.sort(key=lambda x: x["intelligence"] or 0, reverse=True)
    log.info(f"  ✓ {len(records)} records merged, {len(best_ids)} best value")
    return records


# ── Step 4: Upload to Supabase ────────────────────────────────────────────────
def upload(records: list[dict]) -> None:
    supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
    log.info(f"Uploading {len(records)} records...")

    seen: set[str] = set()
    deduped = []
    for r in records:
        if r["id"] not in seen:
            seen.add(r["id"])
            deduped.append(r)

    for i in range(0, len(deduped), 50):
        chunk = deduped[i:i+50]
        supabase.table("ai_models").upsert(chunk, on_conflict="id").execute()
        log.info(f"  Chunk {i//50+1}: {len(chunk)} rows")

    supabase.table("pipeline_meta").upsert({
        "id":          "latest_run",
        "ran_at":      datetime.now(timezone.utc).isoformat(),
        "model_count": len(deduped),
        "source":      "artificial_analysis+openrouter",
    }, on_conflict="id").execute()
    log.info("✅ Upload complete")


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    log.info("=" * 50)
    log.info("AI Benchmarks Pipeline")
    log.info("=" * 50)
    start = time.time()

    aa       = fetch_aa()
    or_p     = fetch_openrouter()
    records  = merge(aa, or_p)

    # Save local JSON
    out = os.path.join(os.path.dirname(__file__), "../data/merged_models.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        json.dump({"updated_at": datetime.now(timezone.utc).isoformat(), "count": len(records), "models": records}, f, indent=2)

    upload(records)
    log.info(f"\n✅ Done in {time.time()-start:.1f}s — {len(records)} models")

if __name__ == "__main__":
    main()
