import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How AI Benchmarks measures and compares AI models — data sources, metrics, and update frequency.",
};

export default function MethodologyPage() {
  return (
    <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
          Methodology
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          All benchmark data is independently measured by <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-hover)" }}>Artificial Analysis</a>. Pricing data comes from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-hover)" }}>OpenRouter</a>.
        </p>
      </div>

      {[
        { emoji: "🧠", title: "Intelligence Index", desc: "A composite score aggregating 10 independent evaluations including GPQA Diamond, MMLU-Pro, HLE, AIME 2025, LiveCodeBench, SciCode, IFBench, AA-LCR, AA-Omniscience, and Terminal-Bench Hard. Higher is better." },
        { emoji: "💻", title: "Coding Index",       desc: "Evaluated on LiveCodeBench (programming problems from LeetCode, AtCoder, Codeforces) and SciCode (Python for scientific computing). Measures real-world software engineering capability." },
        { emoji: "📐", title: "Math Index",         desc: "Evaluated on AIME 2025 (30 problems from American Invitational Mathematics Examination) and MATH-500. Tests olympiad-level mathematical reasoning." },
        { emoji: "⚡", title: "Output Speed",       desc: "Median output tokens per second, measured with a medium-length prompt across multiple providers. Represents real-world user experience." },
        { emoji: "💰", title: "Price per 1M Tokens",desc: "Input and output token prices from OpenRouter's public API. Blended price = (input × 3 + output × 1) / 4, representing a typical 3:1 input/output ratio." },
        { emoji: "🏆", title: "Value Score",        desc: "Intelligence Index divided by blended price per 1M tokens. Higher = better performance per dollar. Models with exceptional value scores (>800) earn the 'Best Value' badge." },
        { emoji: "🔄", title: "Update Frequency",   desc: "Data is refreshed automatically via GitHub Actions every Monday and Thursday at 06:00 UTC. Performance benchmarks from Artificial Analysis are updated when new evaluations are published." },
      ].map((s) => (
        <div key={s.title} className="card" style={{ padding: "20px 24px", marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>{s.emoji}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.desc}</div>
          </div>
        </div>
      ))}

      <div className="card" style={{ padding: "20px 24px", marginTop: 32, background: "var(--accent-dim)", borderColor: "rgba(99,102,241,0.3)" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--accent-hover)", marginBottom: 8 }}>Attribution</div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Intelligence and performance data: <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-hover)" }}>Artificial Analysis</a> (artificialanalysis.ai)<br />
          Pricing data: <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-hover)" }}>OpenRouter</a> (openrouter.ai/api/v1/models)
        </div>
      </div>
    </div>
  );
}
