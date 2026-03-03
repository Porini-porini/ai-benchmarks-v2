import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AI Benchmarks",
  description: "Learn about AI Benchmarks — an independent platform for comparing AI model performance, speed, and pricing.",
};

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div className="badge badge-purple" style={{ marginBottom: 16, display: "inline-flex" }}>
          About Us
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "var(--text-primary)",
          letterSpacing: "-0.03em", marginBottom: 16,
        }}>
          Independent AI Benchmarking,<br />Built for Developers
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.75 }}>
          AI Benchmarks is a free, independent platform that helps developers, researchers, and businesses
          find the right AI model for their needs — based on real data, not marketing claims.
        </p>
      </div>

      {/* Mission */}
      <div className="card" style={{ padding: "28px 32px", marginBottom: 24, borderTop: "3px solid var(--accent)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", marginBottom: 12 }}>
          🎯 Our Mission
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75 }}>
          The AI landscape moves fast. New models launch every week, pricing changes overnight, and benchmark
          numbers are scattered across dozens of sources. We built AI Benchmarks to cut through the noise —
          aggregating independently measured performance data, real-world pricing, and speed metrics into one
          clean, always-updated dashboard.
        </p>
      </div>

      {/* What we offer */}
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", marginBottom: 16 }}>
        What We Offer
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginBottom: 40 }}>
        {[
          { emoji: "📊", title: "Live Benchmark Data",     desc: "Performance scores updated automatically from Artificial Analysis — the leading independent AI benchmarking service." },
          { emoji: "💰", title: "Real Pricing",            desc: "Actual API pricing from OpenRouter, covering input, output, and blended token costs for 100+ models." },
          { emoji: "🏆", title: "Value Rankings",          desc: "Our Value Score (Intelligence ÷ Price) helps you find the most cost-efficient model for your use case." },
          { emoji: "🔍", title: "AI Finder Quiz",          desc: "Answer a few questions about your needs and budget — we'll recommend the top 3 models for you." },
          { emoji: "📐", title: "Category Rankings",       desc: "Separate rankings for Coding, Mathematics, and General Intelligence so you can find the specialist model you need." },
          { emoji: "⚡", title: "Speed Benchmarks",        desc: "Output speed in tokens per second and latency data so you can choose the fastest model for real-time applications." },
        ].map((f) => (
          <div key={f.title} className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{f.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Data sources */}
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", marginBottom: 16 }}>
        Our Data Sources
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {[
          {
            name: "Artificial Analysis",
            url:  "https://artificialanalysis.ai",
            desc: "Provides independently measured Intelligence Index, Coding, Math, speed and latency benchmarks. All evaluations are run on dedicated hardware with consistent methodology.",
            color: "#6366F1",
          },
          {
            name: "OpenRouter",
            url:  "https://openrouter.ai",
            desc: "Aggregates API pricing from 100+ model providers including OpenAI, Anthropic, Google, Meta and more. Pricing data is fetched directly from their public API.",
            color: "#10B981",
          },
        ].map((s) => (
          <div key={s.name} className="card" style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, marginTop: 5, flexShrink: 0 }} />
            <div>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                 style={{ fontWeight: 700, fontSize: 15, color: s.color, textDecoration: "none" }}>
                {s.name} ↗
              </a>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, marginTop: 4 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Update frequency */}
      <div className="card" style={{ padding: "24px 28px", background: "var(--accent-dim)", borderColor: "rgba(99,102,241,0.3)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--accent-hover)", marginBottom: 10 }}>
          🔄 Always Up to Date
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>
          Our data pipeline runs automatically every <strong style={{ color: "var(--text-primary)" }}>Monday and Thursday</strong> via
          GitHub Actions, pulling the latest benchmark scores and pricing from both data sources.
          New models are added automatically — no manual curation required.
        </p>
      </div>
    </div>
  );
}
