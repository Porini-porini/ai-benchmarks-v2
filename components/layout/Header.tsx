"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",          label: "Dashboard" },
  { href: "/rankings",  label: "Rankings"  },
  { href: "/compare",   label: "Compare"   },
  { href: "/finder",    label: "AI Finder" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,11,15,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", height: 60, gap: 32 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: "linear-gradient(135deg, var(--accent), #818CF8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
            fontFamily: "var(--font-display)",
          }}>A</div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>AI Benchmarks</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                textDecoration: "none", transition: "all 0.15s",
                color: active ? "var(--accent-hover)" : "var(--text-secondary)",
                background: active ? "var(--accent-dim)" : "transparent",
              }}>{n.label}</Link>
            );
          })}
        </nav>

        {/* Live badge */}
        <div className="badge badge-green" style={{ flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse 2s infinite" }} />
          Live Data
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </header>
  );
}
