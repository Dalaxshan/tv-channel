import type { MetadataRoute } from "next";
import { shows, news, presenters, episodes, podcasts } from "@/lib/data";

const siteUrl = "https://www.tvchannel.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/watch-live",
    "/programs",
    "/schedule",
    "/news",
    "/videos",
    "/presenters",
    "/gallery",
    "/about",
    "/advertise",
    "/contact",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const showRoutes = shows.map((s) => ({
    url: `${siteUrl}/programs/${s.slug}`,
    lastModified: new Date(),
  }));

  const newsRoutes = news.map((n) => ({
    url: `${siteUrl}/news/${n.slug}`,
    lastModified: n.date,
  }));

  const presenterRoutes = presenters.map((p) => ({
    url: `${siteUrl}/presenters/${p.slug}`,
    lastModified: new Date(),
  }));

  const videoRoutes = [...episodes.map((e) => e.slug), ...podcasts.map((p) => p.slug)].map((slug) => ({
    url: `${siteUrl}/videos/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...showRoutes, ...newsRoutes, ...presenterRoutes, ...videoRoutes];
}
