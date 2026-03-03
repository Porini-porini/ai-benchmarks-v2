import type { MetadataRoute } from "next";

const BASE = "https://aibenchmarks.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                   lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/rankings`,     lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/compare`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/finder`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/methodology`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
