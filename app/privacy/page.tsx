import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for AI Benchmarks — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect minimal information necessary to provide our service. This includes:
      • Usage data such as pages visited and features used (via Google Analytics)
      • Device and browser information for analytics purposes
      • IP addresses (anonymized) for geographic statistics
      We do not collect personally identifiable information unless you voluntarily provide it.`,
    },
    {
      title: "2. Cookies and Tracking",
      content: `We use cookies and similar tracking technologies for:
      • Analytics (Google Analytics) to understand site usage
      • Advertising (Google AdSense) to serve relevant ads
      • Session preferences and settings
      You can control cookie settings through your browser. Disabling cookies may affect site functionality.`,
    },
    {
      title: "3. Google AdSense",
      content: `This site uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings at https://www.google.com/settings/ads.
      
      For more information about how Google uses data, visit: https://policies.google.com/technologies/partner-sites`,
    },
    {
      title: "4. Google Analytics",
      content: `We use Google Analytics to analyze traffic and improve our service. Google Analytics collects information anonymously and reports website trends without identifying individual visitors. To opt out, you can install the Google Analytics opt-out browser add-on at https://tools.google.com/dlpage/gaoptout.`,
    },
    {
      title: "5. Third-Party Data Sources",
      content: `Our benchmark data is sourced from Artificial Analysis (artificialanalysis.ai) and OpenRouter (openrouter.ai). We do not control the data practices of these third parties. Please review their respective privacy policies for more information.`,
    },
    {
      title: "6. Data Retention",
      content: `We do not store personal user data on our servers. Analytics data is retained by Google according to their data retention policies. Benchmark data is updated periodically and stored in our database for display purposes only.`,
    },
    {
      title: "7. Children's Privacy",
      content: `This website is not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.`,
    },
    {
      title: "8. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the date at the top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: "9. Contact Us",
      content: `If you have questions about this Privacy Policy or our data practices, please contact us at: privacy@aibenchmarks.app`,
    },
  ];

  return (
    <div className="container" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 12 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 16, lineHeight: 1.7 }}>
          At AI Benchmarks, we are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights regarding that data.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {sections.map((s) => (
          <div key={s.title} className="card" style={{ padding: "24px 28px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 12 }}>
              {s.title}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {s.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
