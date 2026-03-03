import Link from "next/link";

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)",
      padding: "40px 0",
      marginTop: 80,
    }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>
            AI Benchmarks
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Independent AI model benchmarking. Data from{" "}
            <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer"
               style={{ color: "var(--accent-hover)", textDecoration: "none" }}>Artificial Analysis</a>
            {" "}& <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer"
               style={{ color: "var(--accent-hover)", textDecoration: "none" }}>OpenRouter</a>.
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--text-muted)", flexWrap: "wrap" }}>
          <Link href="/about"       style={{ color: "var(--text-muted)", textDecoration: "none" }}>About</Link>
          <Link href="/contact"     style={{ color: "var(--text-muted)", textDecoration: "none" }}>Contact</Link>
          <Link href="/methodology" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Methodology</Link>
          <Link href="/privacy"     style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms"       style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
