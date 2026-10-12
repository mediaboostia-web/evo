import { EnvelopeSimple, FacebookLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { LogoOnDark } from "@/components/layout/Logo";
import { legalNav, mainNav, site, whatsappLink } from "@/lib/site";

const linkClass =
  "inline-flex min-h-11 items-center rounded-md text-haze transition-colors duration-200 hover:text-white sm:min-h-0 sm:py-1.5";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="pied-de-page" className="on-dark relative overflow-hidden bg-night text-white">
      <div className="container-page relative pt-16 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" aria-label={`${site.fullName} : retour à l'accueil`} className="inline-flex rounded-xl">
              <LogoOnDark />
            </Link>
            <p className="mt-6 max-w-sm text-haze">
              Le répétiteur IA inclusif, conçu au Gabon pour les élèves gabonais. Du primaire au lycée.
            </p>
            <a
              href={site.contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/50 hover:bg-white/10"
              aria-label="Evo sur Facebook (nouvel onglet)"
            >
              <FacebookLogo weight="fill" className="size-5" aria-hidden />
            </a>
          </div>

          <nav aria-label="Plan du site" className="lg:col-span-2">
            <h2 className="font-display text-base font-bold text-white">Le site</h2>
            <ul className="mt-4 flex flex-col">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informations légales" className="lg:col-span-3">
            <h2 className="font-display text-base font-bold text-white">Confiance et données</h2>
            <ul className="mt-4 flex flex-col">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="font-display text-base font-bold text-white">Contact</h2>
            <ul className="mt-4 flex flex-col">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-2 whitespace-nowrap`}>
                  <WhatsappLogo weight="fill" className="size-5 shrink-0 text-cyan" aria-hidden />
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className={`${linkClass} gap-2 whitespace-nowrap`}>
                  <EnvelopeSimple weight="fill" className="size-5 shrink-0 text-cyan" aria-hidden />
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Le nom en très grand : la signature de bas de page. Décoratif, masqué aux lecteurs d'écran. */}
        <p
          aria-hidden
          className="font-display pointer-events-none mt-14 bg-gradient-to-b from-white/[0.14] to-white/0 bg-clip-text text-center text-[clamp(7rem,30vw,24rem)] leading-[0.78] font-extrabold tracking-tighter text-transparent select-none"
        >
          évo
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-haze sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Tous droits réservés.
          </p>
          <p>Conçu au Gabon.</p>
        </div>
      </div>
    </footer>
  );
}
