import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for AI Benchmarks (aibenchmarks.app) — rules and conditions for using our platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using AI Benchmarks at aibenchmarks.app (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.\n\nThese terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "2. Description of Service",
    content: `AI Benchmarks provides an independent platform for comparing AI language model performance, speed, and pricing. Data is sourced from Artificial Analysis (artificialanalysis.ai) and OpenRouter (openrouter.ai) and is updated automatically on a regular schedule.\n\nThe Service is provided for informational purposes only. We do not operate, endorse, or represent any of the AI models listed on this platform.`,
  },
  {
    title: "3. Use of the Service",
    content: `You may use the Service for personal, educational, or commercial research purposes. You agree not to:\n\n• Attempt to reverse engineer, scrape, or systematically download data in bulk without permission\n• Use the Service in any way that could damage, disable, or impair the platform\n• Attempt to gain unauthorized access to any part of the Service\n• Use automated bots or scrapers to access the Service at scale\n• Misrepresent benchmark data or attribute it to sources other than AI Benchmarks and its data providers`,
  },
  {
    title: "4. Data Accuracy and Disclaimer",
    content: `Benchmark data is sourced from third-party providers and is updated automatically. While we strive for accuracy, we cannot guarantee that all data is complete, up-to-date, or error-free.\n\nAI Benchmarks is provided "as is" without warranty of any kind. We do not warrant that the Service will be uninterrupted, that benchmark scores reflect all real-world scenarios, or that pricing information is current at the time of access.\n\nAlways verify pricing and performance data directly with model providers before making commercial decisions.`,
  },
  {
    title: "5. Intellectual Property",
    content: `The design, layout, and original content of AI Benchmarks are the property of aibenchmarks.app. Benchmark data is provided by Artificial Analysis and OpenRouter under their respective terms.\n\nYou may reference and cite our data with proper attribution to aibenchmarks.app. You may not reproduce substantial portions of the platform content without written permission.`,
  },
  {
    title: "6. Advertising",
    content: `The Service displays advertisements served by Google AdSense. These ads are subject to Google's advertising policies. We do not control the content of third-party advertisements.\n\nClicking on advertisements may take you to third-party websites. We are not responsible for the content or practices of those websites.`,
  },
  {
    title: "7. Third-Party Links",
    content: `The Service contains links to third-party websites including Artificial Analysis, OpenRouter, and AI model provider pages. These links are provided for convenience only.\n\nWe have no control over the content of those sites and accept no responsibility for any loss or damage that may arise from your use of them.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, AI Benchmarks and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.\n\nThis includes decisions made based on benchmark data, pricing information, or model recommendations provided by the Service.`,
  },
  {
    title: "9. Changes to These Terms",
    content: `We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes are posted constitutes acceptance of the revised terms.`,
  },
  {
    title: "10. Contact",
    content: `If you have any questions about these Terms of Service, please contact us:\n\nEmail: azzahaza@gmail.com\nWebsite: https://aibenchmarks.app`,
  },
];

export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text-primary)",
          letterSpacing: "-0.03em", marginBottom: 12,
        }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Please read these Terms carefully before using{" "}
          <strong style={{ color: "var(--text-primary)" }}>aibenchmarks.app</strong>.
          By accessing the platform, you agree to be bound by these terms.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SECTIONS.map((s) => (
          <div key={s.title} className="card" style={{ padding: "22px 28px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
              color: "var(--text-primary)", marginBottom: 10,
            }}>
              {s.title}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {s.content}
            </p>
          </div>
        ))}
      </div>

      <div className="card" style={{
        padding: "24px 28px", marginTop: 28, textAlign: "center",
        background: "var(--accent-dim)", borderColor: "rgba(99,102,241,0.3)",
      }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
          Questions about these terms?
        </p>
        <a
          href="mailto:azzahaza@gmail.com"
          style={{
            display: "inline-block", padding: "10px 24px",
            background: "var(--accent)", color: "#fff",
            borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 600,
            textDecoration: "none",
          }}
        >
          azzahaza@gmail.com
        </a>
      </div>
    </div>
  );
}
