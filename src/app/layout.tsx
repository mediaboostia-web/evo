import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Gabarito } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd, siteGraph } from "@/components/seo/JsonLd";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { site } from "@/lib/site";
import "./globals.css";

// Gabarito : géométrique et chaleureuse, comme le logo.
const title = Gabarito({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

// Atkinson Hyperlegible : conçue par le Braille Institute pour les lecteurs malvoyants.
// Le choix de la police est déjà une preuve de la promesse d'accessibilité.
const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const defaultTitle = "Evo, Mon Répétiteur Virtuel | Soutien scolaire IA au Gabon";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s | ${site.fullName}`,
  },
  description: site.description,
  applicationName: site.fullName,
  keywords: [...site.keywords],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "education",
  alternates: {
    canonical: "/",
    languages: { "fr-GA": "/", fr: "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.fullName,
    title: defaultTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, email: true, address: false },
  verification: {
    // Renseigner NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION pour valider la Search Console.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "geo.region": "GA",
    "geo.placename": "Gabon",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1230",
  colorScheme: "light",
};

/**
 * Exécuté avant le premier rendu : signale que JavaScript est actif (animations d'entrée)
 * et rétablit les réglages d'accessibilité choisis lors d'une visite précédente.
 */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add("js");var p=JSON.parse(localStorage.getItem("evo-a11y")||"{}");if(p.text)d.dataset.text="large";if(p.contrast)d.dataset.contrast="high";if(p.motion)d.dataset.motion="reduced";}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${title.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`[data-word]{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#contenu"
          className="sr-only rounded-full bg-ink px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <RevealObserver />
        <JsonLd data={siteGraph} />
      </body>
    </html>
  );
}
