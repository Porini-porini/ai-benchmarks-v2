import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AI Benchmarks team for questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✉️</div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "var(--text-primary)",
          letterSpacing: "-0.03em", marginBottom: 12,
        }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
          Have a question, spotted an error, or want to collaborate? We'd love to hear from you.
        </p>
      </div>

      {/* Email card */}
      <div className="card" style={{ padding: "32px", marginBottom: 24, textAlign: "center", borderTop: "3px solid var(--accent)" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 12 }}>
          Email Us
        </div>
        <a
          href="mailto:azzahaza@gmail.com"
          style={{
            fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700,
            color: "var(--accent-hover)", textDecoration: "none",
            display: "inline-block", padding: "12px 24px",
            background: "var(--accent-dim)", borderRadius: "var(--radius-md)",
            border: "1px solid rgba(99,102,241,0.3)",
            transition: "all 0.15s",
          }}
        >
          azzahaza@gmail.com
        </a>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
          We typically respond within 1–2 business days.
        </p>
      </div>

      {/* Topic cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {[
          {
            emoji: "🐛",
            title: "Report an Error",
            desc:  "Found incorrect benchmark data, a broken feature, or a display issue? Let us know and we'll fix it promptly.",
          },
          {
            emoji: "💡",
            title: "Feature Suggestions",
            desc:  "Have an idea for a new benchmark, comparison feature, or improvement? We're always looking to make the platform better.",
          },
          {
            emoji: "🤝",
            title: "Partnership & Data",
            desc:  "AI companies, benchmarking organizations, or developers interested in data partnerships — reach out to discuss collaboration.",
          },
          {
            emoji: "📰",
            title: "Press & Media",
            desc:  "Journalists or researchers looking to cite our data or learn about our methodology are welcome to contact us.",
          },
        ].map((t) => (
          <div key={t.title} className="card" style={{ padding: "18px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{t.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Website info */}
      <div className="card" style={{ padding: "20px 24px", background: "var(--bg-elevated)", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Website</div>
        <a href="https://aibenchmarks.app" style={{ color: "var(--accent-hover)", fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          aibenchmarks.app
        </a>
      </div>
    </div>
  );
}
