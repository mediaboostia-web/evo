import type { MetadataRoute } from "next";
import { absoluteUrl, legalNav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalUpdated = new Date(site.legal.lastUpdated);

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        absoluteUrl("/images/eleve-revise-le-soir.jpg"),
        absoluteUrl("/images/mere-fille-devoirs.jpg"),
        absoluteUrl("/images/enseignant-explique-lecon.jpg"),
      ],
    },
    ...legalNav.map((item) => ({
      url: absoluteUrl(item.href),
      lastModified: legalUpdated,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
