import { faq, filmTranscript } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

/** Injecte un bloc de données structurées schema.org (JSON-LD). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Le contenu vient uniquement de nos propres constantes ; « < » est neutralisé par précaution.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const organizationId = absoluteUrl("/#organisation");
const websiteId = absoluteUrl("/#site");

/** Organisation + site : présent sur toutes les pages. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization"],
      "@id": organizationId,
      name: site.fullName,
      alternateName: [site.name, site.legalName, "EVO MRV"],
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/icon-512.png"),
        width: 512,
        height: 512,
      },
      image: absoluteUrl("/opengraph-image"),
      description: site.description,
      slogan: site.tagline,
      email: site.contact.email,
      telephone: site.contact.phoneE164,
      address: { "@type": "PostalAddress", addressCountry: site.contact.countryCode },
      areaServed: { "@type": "Country", name: site.contact.country },
      knowsLanguage: "fr",
      knowsAbout: [
        "Soutien scolaire",
        "Aide aux devoirs",
        "Intelligence artificielle appliquée à l'éducation",
        "Éducation inclusive",
        "Accessibilité numérique",
      ],
      sameAs: [site.contact.facebook],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: site.contact.phoneE164,
        email: site.contact.email,
        availableLanguage: ["French"],
        areaServed: site.contact.countryCode,
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.fullName,
      alternateName: site.name,
      description: site.description,
      inLanguage: "fr-GA",
      publisher: { "@id": organizationId },
    },
  ],
};

/** Page d'accueil : le produit, la page et les questions fréquentes. */
export const homeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/#page"),
      url: site.url,
      name: `${site.fullName} : ${site.tagline}`,
      description: site.description,
      inLanguage: "fr-GA",
      isPartOf: { "@id": websiteId },
      about: { "@id": absoluteUrl("/#application") },
      primaryImageOfPage: absoluteUrl("/opengraph-image"),
    },
    ...(site.video.mp4
      ? [
          {
            "@type": "VideoObject",
            "@id": absoluteUrl("/#film"),
            name: `${site.fullName} : le film de présentation`,
            description:
              "Grâce, quinze ans, bloque sur un exercice la veille d'un contrôle. Le film montre comment Evo explique autrement, pour chaque élève, y compris sourd ou malvoyant.",
            thumbnailUrl: absoluteUrl(site.video.poster),
            contentUrl: absoluteUrl(site.video.mp4),
            uploadDate: site.video.uploadDate,
            duration: site.video.duration,
            inLanguage: "fr",
            isFamilyFriendly: true,
            accessibilityFeature: ["openCaptions", "transcript"],
            transcript: filmTranscript.map((line) => line.said).join(" "),
            publisher: { "@id": organizationId },
          },
        ]
      : []),
    {
      "@type": ["SoftwareApplication", "LearningResource"],
      "@id": absoluteUrl("/#application"),
      name: site.fullName,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Android, iOS, Web",
      description: site.description,
      inLanguage: "fr",
      learningResourceType: "Tutorat personnalisé",
      educationalLevel: ["Primaire", "Collège", "Lycée"],
      audience: {
        "@type": "EducationalAudience",
        educationalRole: ["student", "parent", "teacher"],
      },
      accessibilityFeature: [
        "captions",
        "signLanguage",
        "ttsMarkup",
        "braille",
        "highContrastDisplay",
        "largePrint",
      ],
      accessibilityHazard: "none",
      creativeWorkStatus: "En développement, accès anticipé ouvert",
      provider: { "@id": organizationId },
      countryOfOrigin: { "@type": "Country", name: site.contact.country },
    },
    {
      "@type": "FAQPage",
      "@id": absoluteUrl("/#questions"),
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

/** Fil d'Ariane des pages intérieures. */
export function breadcrumb(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}
