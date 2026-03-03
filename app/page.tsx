import type { Metadata } from "next";
import { Suspense } from "react";
import { getModels, getPipelineMeta, TIER_META, formatPrice, formatScore } from "@/lib/api";
import { ModelTable } from "@/components/dashboard/ModelTable";
import { PerformancePriceChart } from "@/components/dashboard/ScatterChart";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "AI Model Benchmarks — Compare LLM Performance, Speed & Price",
  description:
    "Compare 100+ AI models by intelligence index, coding, math, speed and price. Live data from Artificial Analysis. Find the best AI model for your use case.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const [models, meta] = await Promise.all([getModels(), getPipelineMeta()]);

  const top3      = models.slice(0, 3);
  const bestValue = models.filter((m) => m.is_best_value).slice(0, 3);

  const stats = [
    { v: String(models.length), l: "Models Tracked" },
    { v: models.filter((m) => m.price_blended === 0 || m.price_blended === null).length + "+", l: "Free Models" },
    { v: "10+", l: "Benchmarks" },
    { v: meta ? new Date(meta.ran_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today", l: "Last Updated" },
  ];

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 100%)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "72px 0 56px",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="animate-fade-up">
            <div className="badge badge-purple" style={{ marginBottom: 20, display: "inline-flex" }}>
              Powered by Artificial Analysis & OpenRouter
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: 20,
            }}>
              Which AI Model Is<br />
              <span style={{ color: "var(--accent-hover)" }}>Actually the Best?</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.65 }}>
              Independently measured benchmarks. Compare {models.length}+ AI models by intelligence, coding, math, speed and real-world pricing.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
              {stats.map((s) => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.3rem", color: "var(--accent-hover)" }}>{s.v}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ad Banner ─────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: 24 }}>
        <AdSlot slot="1234567890" format="banner" style={{ height: 90 }} />
      </div>

      {/* ── Top 3 Podium ──────────────────────────────────────── */}
      {top3.length > 0 && (
        <section className="container" style={{ paddingTop: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.02em" }}>
            🏆 Top Ranked Models
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {top3.map((m, i) => (
              <div key={m.id} className="card" style={{ padding: "20px", borderTop: `3px solid ${m.color}` }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{["🥇","🥈","🥉"][i]}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "1.5rem", color: m.color }}>{formatScore(m.intelligence)}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>Intelligence Index</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Price: <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>{formatPrice(m.price_blended)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Best Value ────────────────────────────────────────── */}
      {bestValue.length > 0 && (
        <section className="container" style={{ paddingTop: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.02em" }}>
            💰 Best Value Models
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {bestValue.map((m) => {
              const tier = TIER_META[m.efficiency_tier ?? "unknown"];
              return (
                <div key={m.id} className="card" style={{ padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: m.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: m.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{m.provider}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-hover)" }}>
                        ⚡ {formatScore(m.intelligence)}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--green)" }}>
                        {formatPrice(m.price_blended)}/1M
                      </span>
                    </div>
                  </div>
                  <div className="badge" style={{ background: tier.color + "18", color: tier.color, border: `1px solid ${tier.color}44`, flexShrink: 0 }}>
                    {tier.emoji}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="divider container" />

      {/* ── Scatter Chart ─────────────────────────────────────── */}
      <section className="container" style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.02em" }}>
          📊 Performance vs. Price
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Models in the top-left quadrant offer the best value — high intelligence at low cost.
        </p>
        <Suspense fallback={<div className="skeleton" style={{ height: 420 }} />}>
          <PerformancePriceChart models={models} />
        </Suspense>
      </section>

      {/* ── Ad Rectangle ──────────────────────────────────────── */}
      <div className="container" style={{ marginBottom: 48, display: "flex", justifyContent: "center" }}>
        <AdSlot slot="2345678901" format="rectangle" style={{ height: 250 }} />
      </div>

      {/* ── Full Model Table ───────────────────────────────────── */}
      <section className="container" style={{ marginBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              All Models
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              Data sourced from <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-hover)", textDecoration: "none" }}>Artificial Analysis</a> & <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-hover)", textDecoration: "none" }}>OpenRouter</a>
            </p>
          </div>
        </div>
        <div className="card" style={{ padding: "0 0 8px" }}>
          <Suspense fallback={<div className="skeleton" style={{ height: 400, margin: 16 }} />}>
            <ModelTable models={models} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
