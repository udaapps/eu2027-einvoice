import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eu2027.aabready.com";

  return [
    {
      url: baseUrl,
      lastModified: "2026-11-19",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/battery-qr-2027`,
      lastModified: "2026-11-19",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: "2026-11-19",
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}