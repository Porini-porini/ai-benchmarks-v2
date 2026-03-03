"use client";

import { useState, useEffect } from "react";
import type { AIModel } from "@/lib/types";
import { formatPrice, formatScore, formatSpeed, TIER_META } from "@/lib/api";

interface Answer { use_case: string; budget: string; speed: string; reasoning: string }

const QUESTIONS = [
  {
    id: "use_case",
    question: "What will you primarily use this AI for?",
    options: [
      { value: "coding",    label: "💻 Coding & Development",   desc: "Code generation, debugging, reviews" },
      { value: "math",      label: "📐 Math & Science",         desc: "Complex calculations, research" },
      { value: "writing",   label: "✍️ Writing & Analysis",     desc: "Essays, summaries, editing" },
      { value: "general",   label: "🌐 General Purpose",        desc: "Chatting, Q&A, everyday tasks" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget per 1M tokens?",
    options: [
      { value: "free",      label: "🆓 Free only",              desc: "Open-source or free-tier models" },
      { value: "low",       label: "💚 Under $1",               desc: "Cost-conscious usage" },
      { value: "medium",    label: "💛 $1 – $10",               desc: "Balance of cost and quality" },
      { value: "high",      label: "💎 Any budget",             desc: "Best performance regardless of price" },
    ],
  },
  {
    id: "speed",
    question: "How important is response speed?",
    options: [
      { value: "critical",  label: "⚡ Very important",         desc: "Real-time apps, live chat" },
      { value: "moderate",  label: "👍 Somewhat important",     desc: "Interactive tools" },
      { value: "low",       label: "🐢 Not important",          desc: "Batch processing, research" },
    ],
  },
  {
    id: "reasoning",
    question: "Do you need advanced reasoning / thinking mode?",
    options: [
      { value: "yes",       label: "🧠 Yes — deep reasoning",   desc: "Complex multi-step problems" },
      { value: "no",        label: "⚡ No — standard mode",     desc: "Fast, direct answers" },
    ],
  },
];

function scoreModel(model: AIModel, answers: Answer): number {
  let score = 0;

  // Use case weighting
  if (answers.use_case === "coding" && model.coding != null)      score += model.coding * 2;
  else if (answers.use_case === "math" && model.math != null)     score += model.math   * 2;
  else if (model.intelligence != null)                             score += model.intelligence;

  // Budget filter
  const price = model.price_blended ?? 0;
  if (answers.budget === "free"   && price > 0)    score -= 9999;
  if (answers.budget === "low"    && price > 1)    score -= 500;
  if (answers.budget === "medium" && price > 10)   score -= 200;

  // Speed weighting
  const spd = model.output_speed ?? 0;
  if (answers.speed === "critical")   score += spd * 0.3;
  if (answers.speed === "moderate")   score += spd * 0.1;

  // Reasoning bonus (heuristic: models with high intelligence and no speed penalty)
  if (answers.reasoning === "yes")  score += (model.intelligence ?? 0) * 0.5;
  if (answers.reasoning === "no"  && spd > 80) score += 30;

  // Value bonus
  if (model.is_best_value) score += 20;

  return score;
}

export default function FinderPage() {
  const [models,  setModels]  = useState<AIModel[]>([]);
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState<Partial<Answer>>({});
  const [results, setResults] = useState<AIModel[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/models?limit=200")
      .then((r) => r.json())
      .then((d) => { setModels(d.models ?? []); setLoading(false); });
  }, []);

  function answer(key: string, value: string) {
    const next = { ...answers, [key]: value } as Partial<Answer>;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const full = next as Answer;
      const scored = models
        .map((m) => ({ model: m, score: scoreModel(m, full) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.model);
      setResults(scored);
    }
  }

  function reset() { setStep(0); setAnswers({}); setResults(null); }

  const q = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  if (loading) return (
    <div className="container" style={{ paddingTop: 80, textAlign: "center" }}>
      <div className="skeleton" style={{ height: 400, maxWidth: 600, margin: "0 auto" }} />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 680 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
          🔍 AI Model Finder
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
          Answer a few questions and we'll recommend the best AI model for you.
        </p>
      </div>

      {results ? (
        /* Results */
        <div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎯</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", marginBottom: 8 }}>
              Your Top Picks
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Based on your preferences</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            {results.map((m, i) => {
              const tier = TIER_META[m.efficiency_tier ?? "unknown"];
              return (
                <div key={m.id} className="card" style={{ padding: 24, borderLeft: `4px solid ${m.color}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>{["🥇","🥈","🥉"][i]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>{m.name}</div>
                          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.provider}</div>
                        </div>
                        <div className="badge" style={{ background: tier.color + "18", color: tier.color, border: `1px solid ${tier.color}44` }}>
                          {tier.emoji} {tier.label}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {[
                          { l: "Intelligence", v: formatScore(m.intelligence), c: "var(--accent-hover)" },
                          { l: "Coding",       v: formatScore(m.coding),       c: "var(--blue)"         },
                          { l: "Speed",        v: formatSpeed(m.output_speed), c: "var(--amber)"        },
                          { l: "Price/1M",     v: formatPrice(m.price_blended),c: "var(--green)"        },
                        ].map((s) => (
                          <div key={s.l} style={{ background: "var(--bg-elevated)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: s.c }}>{s.v}</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="btn btn-ghost" onClick={reset} style={{ fontSize: 15 }}>
              ↩ Start Over
            </button>
          </div>
        </div>
      ) : (
        /* Quiz */
        <div>
          {/* Progress bar */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Question {step + 1} of {QUESTIONS.length}</span>
              <span style={{ fontSize: 13, color: "var(--accent-hover)", fontFamily: "var(--font-mono)" }}>{Math.round(progress + 25)}%</span>
            </div>
            <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress + 25}%`, background: "var(--accent)", borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Question */}
          <div className="card" style={{ padding: "32px 28px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 28, lineHeight: 1.3 }}>
              {q.question}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answer(q.id, opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 20px", borderRadius: 12, cursor: "pointer",
                    background: "var(--bg-elevated)", border: "1.5px solid var(--border-default)",
                    textAlign: "left", transition: "all 0.15s", width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.background  = "var(--accent-dim)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)";
                    (e.currentTarget as HTMLButtonElement).style.background  = "var(--bg-elevated)";
                  }}
                >
                  <div style={{ fontSize: "1.4rem", flexShrink: 0, width: 36, textAlign: "center" }}>
                    {opt.label.split(" ")[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                      {opt.label.split(" ").slice(1).join(" ")}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {step > 0 && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button className="btn btn-ghost" style={{ fontSize: 13 }}
                onClick={() => setStep((s) => s - 1)}>← Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
