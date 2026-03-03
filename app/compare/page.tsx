"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import type { AIModel } from "@/lib/types";
import { formatPrice, formatScore, formatSpeed, TIER_META } from "@/lib/api";

export default function ComparePage() {
  const [models,   setModels]   = useState<AIModel[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/models?limit=200")
      .then((r) => r.json())
      .then((d) => {
        const list: AIModel[] = d.models ?? [];
        setModels(list);
        // Default: top 3
        setSelected(list.slice(0, 3).map((m) => m.id));
        setLoading(false);
      });
  }, []);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((x) => x !== id) : prev
        : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const compared = models.filter((m) => selected.includes(m.id));
  const filtered = search ? models.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.provider.toLowerCase().includes(search.toLowerCase())
  ) : models;

  const chartData = [
    { metric: "Intelligence", ...Object.fromEntries(compared.map((m) => [m.name, m.intelligence])) },
    { metric: "Coding",       ...Object.fromEntries(compared.map((m) => [m.name, m.coding])) },
    { metric: "Math",         ...Object.fromEntries(compared.map((m) => [m.name, m.math])) },
  ];

  const speedData = compared
    .filter((m) => m.output_speed != null)
    .map((m) => ({ name: m.name, speed: m.output_speed, color: m.color }));

  const ROWS = [
    { label: "Intelligence Index", get: (m: AIModel) => formatScore(m.intelligence),   best: "max", raw: (m: AIModel) => m.intelligence },
    { label: "Coding Index",       get: (m: AIModel) => formatScore(m.coding),         best: "max", raw: (m: AIModel) => m.coding       },
    { label: "Math Index",         get: (m: AIModel) => formatScore(m.math),           best: "max", raw: (m: AIModel) => m.math          },
    { label: "GPQA",               get: (m: AIModel) => formatScore((m.gpqa ?? 0)*100, 1) + "%", best: "max", raw: (m: AIModel) => m.gpqa },
    { label: "Input Price/1M",     get: (m: AIModel) => formatPrice(m.price_input),    best: "min", raw: (m: AIModel) => m.price_input   },
    { label: "Output Price/1M",    get: (m: AIModel) => formatPrice(m.price_output),   best: "min", raw: (m: AIModel) => m.price_output  },
    { label: "Output Speed",       get: (m: AIModel) => formatSpeed(m.output_speed),   best: "max", raw: (m: AIModel) => m.output_speed  },
    { label: "Value Score",        get: (m: AIModel) => m.value_score != null ? Math.round(m.value_score).toString() : "—", best: "max", raw: (m: AIModel) => m.value_score },
    { label: "Efficiency Tier",    get: (m: AIModel) => { const t = TIER_META[m.efficiency_tier ?? "unknown"]; return `${t.emoji} ${t.label}`; }, best: null, raw: () => null },
  ];

  if (loading) return <div className="container" style={{ paddingTop: 48 }}><div className="skeleton" style={{ height: 600 }} /></div>;

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Model Comparison
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Select up to 4 models to compare side by side.
        </p>
      </div>

      {/* Model selector */}
      <div className="card" style={{ padding: 20, marginBottom: 32 }}>
        <input
          className="input"
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320, marginBottom: 16 }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 200, overflowY: "auto" }}>
          {filtered.map((m) => {
            const sel = selected.includes(m.id);
            return (
              <button key={m.id} onClick={() => toggle(m.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                  border: `1.5px solid ${sel ? m.color : "var(--border-default)"}`,
                  background: sel ? m.color + "18" : "transparent",
                  color: sel ? m.color : "var(--text-muted)",
                  fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)",
                  transition: "all 0.15s",
                }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {compared.length < 2 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
          Select at least 2 models to compare
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Intelligence/Coding/Math Bar Chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>
              Performance Benchmarks
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="metric" tick={{ fontFamily: "var(--font-body)", fontSize: 12, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 8, fontFamily: "var(--font-body)" }} />
                <Legend wrapperStyle={{ fontFamily: "var(--font-body)", fontSize: 13 }} />
                {compared.map((m) => (
                  <Bar key={m.id} dataKey={m.name} fill={m.color} radius={[4, 4, 0, 0]} maxBarSize={40} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Speed Chart */}
          {speedData.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20 }}>
                Output Speed (tokens/sec)
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={speedData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontFamily: "var(--font-body)", fontSize: 12, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 8 }} />
                  <Bar dataKey="speed" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {speedData.map((d) => <Cell key={d.name} fill={d.color} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Comparison table */}
          <div className="card" style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ width: 160 }}>Metric</th>
                  {compared.map((m) => (
                    <th key={m.id} style={{ textAlign: "center", color: m.color }}>{m.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const raws = compared.map((m) => row.raw(m));
                  const nums = raws.filter((v) => typeof v === "number" && v > 0) as number[];
                  const best = row.best === "max" ? Math.max(...nums) : row.best === "min" ? Math.min(...nums) : null;
                  return (
                    <tr key={row.label}>
                      <td style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: 13 }}>{row.label}</td>
                      {compared.map((m, i) => {
                        const isBest = best !== null && raws[i] === best;
                        return (
                          <td key={m.id} style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 14, background: isBest ? m.color + "12" : "transparent", fontWeight: isBest ? 700 : 400, color: isBest ? m.color : "var(--text-secondary)" }}>
                            {isBest && "✓ "}{row.get(m)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
