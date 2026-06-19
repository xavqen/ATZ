import type { MetadataRoute } from "next";
import { LETTERS } from "@/lib/ads";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://atz-pages.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "about", "privacy", "terms", "leaderboard", "profile", "login", "signup", "forgot"];
  const allRoutes = [...staticRoutes, ...LETTERS];

  return allRoutes.map((route) => ({
    url: route ? `${baseUrl}/${route}` : `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
