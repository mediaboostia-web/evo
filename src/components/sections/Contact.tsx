import { EnvelopeSimple, LockKey, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/sections/ContactForm";
import { site, whatsappLink } from "@/lib/site";

const contactLink =
  "inline-flex min-h-12 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-2 pr-5 pl-2 font-bold text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10";

/** « Je fais quoi maintenant ? » Une seule action : réserver une place. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="on-dark relative isolate overflow-hidden rounded-[2rem] bg-navy-900 text-white md:rounded-[3rem]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_0%_0%,rgb(0_103_255/0.5),transparent_70%),radial-gradient(45%_45%_at_100%_100%,rgb(58_216_251/0.16),transparent_70%)]"
        />

        <div className="container-page section-y grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div data-reveal="up" className="lg:col-span-6">
            <Image
              src="/brand/evo-mascot-cutout.png"
              alt=""
              width={240}
              height={280}
              sizes="96px"
              className="h-24 w-auto drop-shadow-[0_18px_30px_rgb(0_103_255/0.55)] sm:h-28"
            />
            <h2 id="contact-title" className="text-h2 mt-8">
              N&apos;attendez pas le prochain bulletin.
            </h2>
            <p className="text-lead mt-5 max-w-xl text-haze">
              Evo est en développement. Les premières familles inscrites l&apos;essaieront en premier et nous aideront à le
              façonner.
            </p>

            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-cyan">
                    <WhatsappLogo weight="fill" className="size-5" aria-hidden />
                  </span>
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className={contactLink}>
                  <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-cyan">
                    <EnvelopeSimple weight="fill" className="size-5" aria-hidden />
                  </span>
                  {site.contact.email}
                </a>
              </li>
            </ul>

            <p className="mt-8 flex max-w-xl items-start gap-3 text-[0.9375rem] text-haze">
              <LockKey weight="fill" className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
              <span>
                Aucun cookie publicitaire, aucun traceur.{" "}
                <Link href="/securite-des-donnees" className="font-bold text-white underline underline-offset-4">
                  Comment nous protégeons vos données
                </Link>
              </span>
            </p>
          </div>

          <div data-reveal="up" className="lg:col-span-6 lg:pl-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
