"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ZAxis, ReferenceLine,
} from "recharts";
import type { AIModel } from "@/lib/types";
import { TIER_META } from "@/lib/api";

interface Props { models: AIModel[] }

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as AIModel & { x: number; y: number };
  if (!d) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
      borderRadius: 12, padding: "12px 16px", boxShadow: "var(--shadow-md)",
      fontFamily: "var(--font-body)", minWidth: 180,
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", marginBottom: 8 }}>{d.name}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 12px" }}>
        <span>Provider:</span>   <span style={{ color: "var(--text-primary)" }}>{d.provider}</span>
        <span>Intelligence:</span><span style={{ color: "var(--accent-hover)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{d.intelligence?.toFixed(1) ?? "—"}</span>
        <span>Price/1M:</span>   <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>${d.price_blended?.toFixed(3) ?? "Free"}</span>
        {d.value_score != null && <><span>Value:</span><span style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>{Math.round(d.value_score)}</span></>}
      </div>
      {d.is_best_value && (
        <div className="badge badge-green" style={{ marginTop: 8 }}>🏆 Best Value</div>
      )}
    </div>
  );
}

export function PerformancePriceChart({ models }: Props) {
  const data = models
    .filter((m) => m.intelligence != null && m.price_blended != null && m.price_blended > 0)
    .map((m) => ({
      ...m,
      x: m.price_blended!,
      y: m.intelligence!,
    }));

  if (!data.length) return null;

  const avgIntel = data.reduce((s, m) => s + m.y, 0) / data.length;
  const avgPrice = data.reduce((s, m) => s + m.x, 0) / data.length;

  return (
    <div className="card" style={{ padding: "24px 16px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingLeft: 8 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
            Performance vs. Price
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Top-left = best value · Top-right = premium · Bottom-left = cheap
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {["exceptional", "great", "good"].map((tier) => (
            <div key={tier} className="badge badge-gray" style={{ borderColor: TIER_META[tier].color + "44", color: TIER_META[tier].color }}>
              {TIER_META[tier].emoji} {TIER_META[tier].label}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
          <XAxis
            type="number" dataKey="x" name="Price/1M tokens"
            label={{ value: "Price per 1M tokens (USD)", position: "insideBottom", offset: -15, fontSize: 11, fill: "var(--text-muted)" }}
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }}
            tickFormatter={(v) => `$${v}`}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="number" dataKey="y" name="Intelligence Index"
            label={{ value: "Intelligence Index", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--text-muted)", offset: 10 }}
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false} tickLine={false}
          />
          <ZAxis range={[50, 50]} />
          <ReferenceLine x={avgPrice} stroke="var(--border-default)" strokeDasharray="4 4" />
          <ReferenceLine y={avgIntel} stroke="var(--border-default)" strokeDasharray="4 4" />
          <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            data={data}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const m = payload as AIModel;
              const tier = TIER_META[m.efficiency_tier ?? "unknown"];
              return (
                <g>
                  <circle cx={cx} cy={cy} r={m.is_best_value ? 9 : 6}
                    fill={m.color} fillOpacity={0.85}
                    stroke={m.is_best_value ? "#fff" : "none"} strokeWidth={2} />
                  {m.is_best_value && (
                    <text x={cx + 11} y={cy + 4} fontSize={9} fill="var(--green)" fontFamily="var(--font-body)" fontWeight={700}>
                      {m.name.split(" ").slice(0, 2).join(" ")}
                    </text>
                  )}
                </g>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
