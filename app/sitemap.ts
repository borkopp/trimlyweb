import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fadely.app",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://fadely.app/contact",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: "https://fadely.app/privacy-policy",
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: "https://fadely.app/terms",
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: "https://fadely.app/apps/art-barbershop/privacy-policy",
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: "https://fadely.app/apps/art-barbershop/terms",
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: "https://fadely.app/apps/art-barbershop/account-deletion",
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];
}
