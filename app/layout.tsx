import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://aibenchmarks.app"),
  title: {
    default: "AI Benchmarks — Compare LLM Performance, Speed & Pricing",
    template: "%s | AI Benchmarks",
  },
  description:
    "Compare AI models by intelligence, coding, math, speed and price. Live benchmark data from Artificial Analysis. Find the best AI model for your needs.",
  keywords: ["AI benchmark", "LLM comparison", "GPT-4o", "Claude", "Gemini", "AI model ranking", "AI pricing"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aibenchmarks.app",
    siteName: "AI Benchmarks",
    title: "AI Benchmarks — Compare LLM Performance, Speed & Pricing",
    description: "Live benchmark data. Find the best AI model for your needs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Benchmarks",
    description: "Compare AI models by intelligence, speed and price.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AI Benchmarks",
              url: "https://aibenchmarks.app",
              description: "Compare AI model performance, speed and pricing.",
            }),
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
