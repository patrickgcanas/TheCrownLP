import type { MetadataRoute } from "next";

import { getShows } from "@/lib/midia-data";
import { siteUrl as baseUrl } from "@/lib/site";

// Mapa do site entregue ao Google (Search Console): páginas principais + um álbum por show
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/historia", "/midia", "/depoimentos", "/contato", "/contrate"];
  const shows = await getShows();

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...shows.map((show) => ({
      url: `${baseUrl}/midia/${show.id}`,
      lastModified: new Date(show.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
