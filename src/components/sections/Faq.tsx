import { Plus, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { faq } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

/**
 * Les derniers doutes, levés honnêtement.
 * Accordéon natif <details> : fonctionne sans JavaScript, une seule réponse ouverte à la fois.
 */
export function Faq() {
  return (
    <section id="questions" aria-labelledby="questions-title" className="section-y scroll-mt-10">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-reveal="up" className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="questions-title" className="text-h2">
              Ce que les parents nous demandent.
            </h2>
            <p className="text-lead mt-5 text-copy">Une autre question ? Écrivez-nous, une vraie personne vous répond.</p>
            <a
              href={whatsappLink("Bonjour Evo, j'ai une question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3.5 rounded-full border border-line bg-white py-2 pr-6 pl-2 font-bold text-ink transition-colors duration-200 hover:border-ink"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-ok-soft text-ok">
                <WhatsappLogo weight="fill" className="size-6" aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-normal text-muted">WhatsApp</span>
                {site.contact.phoneDisplay}
              </span>
            </a>
          </div>
        </div>

        <div data-reveal="up" className="lg:col-span-7">
          {faq.map((item, index) => (
            <details
              key={item.question}
              name="faq"
              open={index === 0}
              className="faq-item group border-b border-line-soft first:border-t"
            >
              <summary className="flex items-center justify-between gap-6 py-5 sm:py-6">
                <h3 className="font-display text-[1.1875rem] leading-snug font-bold tracking-tight text-ink sm:text-[1.375rem]">
                  {item.question}
                </h3>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-evo-50 text-evo-700 transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-evo-600 group-open:text-white">
                  <Plus weight="bold" className="size-5" aria-hidden />
                </span>
              </summary>
              <p className="max-w-[60ch] pr-4 pb-6 text-copy sm:pr-16">
                {item.answer}
                {item.question.includes("données") ? (
                  <>
                    {" "}
                    <Link
                      href="/politique-de-confidentialite"
                      className="font-bold text-evo-700 underline underline-offset-4"
                    >
                      Lire la politique de confidentialité
                    </Link>
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
