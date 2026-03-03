"use client";

import { useState, useMemo } from "react";
import type { AIModel, SortKey } from "@/lib/types";
import { TIER_META, formatPrice, formatScore, formatSpeed } from "@/lib/api";

interface Props { models: AIModel[] }

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "intelligence",  label: "Intelligence" },
  { key: "coding",        label: "Coding"       },
  { key: "math",          label: "Math"         },
  { key: "value_score",   label: "Best Value"   },
  { key: "price_blended", label: "Cheapest"     },
  { key: "output_speed",  label: "Fastest"      },
];

export function ModelTable({ models }: Props) {
  const [sort,   setSort]   = useState<SortKey>("intelligence");
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(0);
  const PAGE = 20;

  const sorted = useMemo(() => {
    let list = [...models];
    if (search) list = list.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      const av = (a[sort] ?? -Infinity) as number;
      const bv = (b[sort] ?? -Infinity) as number;
      return sort === "price_blended" ? av - bv : bv - av;
    });
    return list;
  }, [models, sort, search]);

  const paged  = sorted.slice(page * PAGE, (page + 1) * PAGE);
  const total  = sorted.length;
  const pages  = Math.ceil(total / PAGE);

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="input"
          placeholder="Search models or providers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          style={{ maxWidth: 280 }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.key}
              className={`btn btn-ghost${sort === o.key ? " active" : ""}`}
              style={{ padding: "6px 14px", fontSize: 13 }}
              onClick={() => { setSort(o.key); setPage(0); }}
            >{o.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--text-muted)" }}>
          {total} models
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Model</th>
              <th className="hide-mobile">Provider</th>
              <th style={{ textAlign: "right" }}>Intelligence</th>
              <th style={{ textAlign: "right" }} className="hide-mobile">Coding</th>
              <th style={{ textAlign: "right" }} className="hide-mobile">Math</th>
              <th style={{ textAlign: "right" }}>Price/1M</th>
              <th style={{ textAlign: "right" }} className="hide-mobile">Speed</th>
              <th style={{ textAlign: "right" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((m, i) => {
              const tier   = TIER_META[m.efficiency_tier ?? "unknown"];
              const rank   = page * PAGE + i + 1;
              return (
                <tr key={m.id} style={{ cursor: "default" }}>
                  <td>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: rank <= 3 ? ["#FFD700","#C0C0C0","#CD7F32"][rank-1] : "var(--text-muted)",
                      fontWeight: rank <= 3 ? 700 : 400,
                    }}>{rank <= 3 ? ["🥇","🥈","🥉"][rank-1] : `#${rank}`}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{m.name}</div>
                        {m.is_best_value && (
                          <span className="badge badge-green" style={{ marginTop: 2 }}>🏆 Best Value</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hide-mobile" style={{ fontSize: 13 }}>{m.provider}</td>
                  <td style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent-hover)" }}>
                      {formatScore(m.intelligence)}
                    </span>
                  </td>
                  <td className="hide-mobile" style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {formatScore(m.coding)}
                  </td>
                  <td className="hide-mobile" style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {formatScore(m.math)}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--green)" }}>
                    {formatPrice(m.price_blended)}
                  </td>
                  <td className="hide-mobile" style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {formatSpeed(m.output_speed)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {m.value_score != null ? (
                      <span style={{
                        fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13,
                        color: tier.color,
                      }}>{tier.emoji} {Math.round(m.value_score)}</span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }}
            disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span style={{ padding: "6px 14px", fontSize: 13, color: "var(--text-muted)" }}>
            {page + 1} / {pages}
          </span>
          <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }}
            disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
