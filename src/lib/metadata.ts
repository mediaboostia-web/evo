import type { Metadata } from "next";
import { site } from "@/lib/site";

/** La carte de partage générée par src/app/opengraph-image.tsx, reprise sur les pages intérieures. */
const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.fullName} : ${site.tagline}`,
};

/** Métadonnées d'une page intérieure : titre, description, URL canonique et carte de partage cohérentes. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: site.locale,
      url: path,
      siteName: site.fullName,
      title: `${title} | ${site.fullName}`,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.fullName}`,
      description,
      images: [shareImage],
    },
  };
}
