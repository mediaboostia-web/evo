/**
 * Source unique des informations du site : identité, contact, vidéo, mentions légales.
 * Tout ce qui est susceptible de changer se modifie ici, pas dans les composants.
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evomrv.ga").replace(/\/$/, "");

export const site = {
  name: "Evo",
  legalName: "Mon Répétiteur Virtuel",
  fullName: "Evo, Mon Répétiteur Virtuel",
  url: siteUrl,
  locale: "fr_GA",
  lang: "fr",
  tagline: "Un répétiteur pour chaque élève.",
  description:
    "Evo, le répétiteur IA conçu au Gabon : il explique, fait pratiquer et corrige les devoirs, du primaire au lycée. Accessible aux élèves sourds et malvoyants.",
  keywords: [
    "répétiteur virtuel",
    "soutien scolaire Gabon",
    "aide aux devoirs",
    "répétiteur IA",
    "tuteur intelligence artificielle",
    "EdTech Gabon",
    "cours particuliers Gabon",
    "éducation inclusive",
    "élèves malentendants",
    "élèves malvoyants",
    "Evo",
    "Mon Répétiteur Virtuel",
  ],

  contact: {
    phoneDisplay: "+241 77 20 17 87",
    phoneE164: "+24177201787",
    whatsapp: "24177201787",
    email: "contact@evomrv.ga",
    facebook: "https://www.facebook.com/share/1DeYaJqyXm/?mibextid=wwXIfr",
    country: "Gabon",
    countryCode: "GA",
  },

  /**
   * Film de présentation (16:9, 1920 x 1080), affiché juste après le héros.
   * Renseigner SOIT `mp4` (fichier déposé dans /public/video), SOIT `youtubeId`.
   * Tant que les deux sont vides, le cadre affiche l'affiche et la mention « bientôt disponible ».
   */
  video: {
    mp4: "" as string, // ex. "/video/evo-presentation.mp4"
    youtubeId: "" as string, // ex. "dQw4w9WgXcQ"
    captions: "" as string, // ex. "/video/evo-presentation.fr.vtt"
    poster: "/images/eleve-revise-le-soir.jpg",
    durationLabel: "60 secondes",
  },

  /**
   * Mentions légales. Les valeurs `null` s'affichent « À compléter » sur les pages
   * juridiques : elles doivent être renseignées par l'éditeur avant la mise en ligne.
   */
  legal: {
    lastUpdated: "2026-10-12",
    companyForm: null as string | null, // ex. "SARL au capital de 1 000 000 FCFA"
    rccm: null as string | null, // Registre du Commerce et du Crédit Mobilier
    nif: null as string | null, // Numéro d'Identification Fiscale
    address: null as string | null, // Siège social
    publisher: null as string | null, // Directeur de la publication
    dpo: "contact@evomrv.ga", // Contact pour la protection des données
    host: {
      name: null as string | null, // ex. "Vercel Inc."
      address: null as string | null,
      website: null as string | null,
    },
  },
} as const;

export type Site = typeof site;

/** Navigation principale. Les ancres reprennent celles du site d'origine (#apropos, #solution, #contact). */
export const mainNav = [
  { label: "À propos", href: "/#apropos" },
  { label: "Problématique", href: "/#problematique" },
  { label: "Solution", href: "/#solution" },
  { label: "Accessibilité", href: "/#accessibilite" },
  { label: "Questions", href: "/#questions" },
] as const;

export const legalNav = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "Sécurité des données", href: "/securite-des-donnees" },
  { label: "Conditions d'utilisation", href: "/conditions-utilisation" },
  { label: "Accessibilité du site", href: "/accessibilite" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
