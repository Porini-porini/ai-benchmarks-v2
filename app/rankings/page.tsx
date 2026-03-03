"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AIModel, Category } from "@/lib/types";
import { formatScore } from "@/lib/api";

const CATEGORIES: { key: Category; label: string; emoji: string; desc: string; field: keyof AIModel }[] = [
  { key: "intelligence", label: "Overall Intelligence", emoji: "🧠", desc: "Composite score across reasoning, knowledge, math & coding", field: "intelligence" },
  { key: "coding",       label: "Coding",               emoji: "💻", desc: "Code generation, debugging and software engineering tasks", field: "coding"       },
  { key: "math",         label: "Mathematics",          emoji: "📐", desc: "Mathematical reasoning, problem solving and AIME benchmark", field: "math"         },
];

export default function RankingsPage() {
  const [models,   setModels]   = useState<AIModel[]>([]);
  const [category, setCategory] = useState<Category>("intelligence");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/models?limit=200")
      .then((r) => r.json())
      .then((d) => { setModels(d.models ?? []); setLoading(false); });
  }, []);

  const cat = CATEGORIES.find((c) => c.key === category)!;
  const ranked = [...models]
    .filter((m) => m[cat.field] != null && (m[cat.field] as number) > 0)
    .sort((a, b) => ((b[cat.field] as number) ?? 0) - ((a[cat.field] as number) ?? 0))
    .slice(0, 25);

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Category Rankings
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Find the best AI model for specific tasks. Top 25 models per category.
        </p>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`btn btn-ghost${category === c.key ? " active" : ""}`}
            style={{ fontSize: 14, padding: "8px 20px" }}
            onClick={() => setCategory(c.key)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "1.6rem" }}>{cat.emoji}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>{cat.label}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{cat.desc}</div>
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 600 }} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Bar chart */}
          <div className="card" style={{ padding: "24px 12px" }}>
            <ResponsiveContainer width="100%" height={ranked.length * 36 + 20}>
              <BarChart
                data={ranked.map((m) => ({ name: m.name, score: m[cat.field] as number, color: m.color }))}
                layout="vertical" margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--border-subtle)" />
                <XAxis type="number" tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{label}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent-hover)" }}>{(payload[0].value as number).toFixed(1)}</div>
                      </div>
                    ) : null
                  }
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={22}>
                  {ranked.map((m) => <Cell key={m.id} fill={m.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranked list */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {ranked.map((m, i) => (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                borderBottom: i < ranked.length - 1 ? "1px solid var(--border-subtle)" : "none",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "var(--text-muted)", fontWeight: i < 3 ? 700 : 400, width: 28 }}>
                  {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i+1}`}
                </span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.provider}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15, color: m.color }}>
                  {formatScore(m[cat.field] as number | null)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
