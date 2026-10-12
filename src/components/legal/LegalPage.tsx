import { ArrowLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumb, JsonLd } from "@/components/seo/JsonLd";
import { legalNav, site } from "@/lib/site";

export type LegalSection = { id: string; title: string; content: ReactNode };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Valeur à fournir par l'éditeur avant la mise en ligne : signalée clairement tant qu'elle manque. */
export function Fill({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <span className="todo">À compléter : {label}</span>;
}

/** Gabarit commun aux pages juridiques : fil d'Ariane, résumé « En bref », sommaire, texte. */
export function LegalPage({
  title,
  path,
  intro,
  summary,
  sections,
}: {
  title: string;
  path: string;
  intro: string;
  summary?: string[];
  sections: LegalSection[];
}) {
  return (
    <>
      <div className="bg-evo-50 pt-30 pb-12 sm:pt-36 md:pb-16">
        <div className="container-page">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-2 text-[0.9375rem] text-muted">
              <li>
                <Link href="/" className="rounded-md font-bold text-evo-700 hover:underline">
                  Accueil
                </Link>
              </li>
              <li aria-hidden>
                <CaretRight weight="bold" className="size-3.5" />
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <h1 className="text-h2 mt-6 max-w-4xl">{title}</h1>
          <p className="text-lead mt-5 max-w-3xl text-copy">{intro}</p>
          <p className="mt-6 text-[0.9375rem] text-muted">
            Dernière mise à jour : <time dateTime={site.legal.lastUpdated}>{dateFormat.format(new Date(site.legal.lastUpdated))}</time>
          </p>
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        <aside className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <nav aria-label="Sommaire" className="rounded-[1.5rem] border border-line-soft p-5 sm:p-6">
              <h2 className="font-display text-lg font-bold text-ink">Sommaire</h2>
              <ol className="mt-3 flex flex-col text-[0.9375rem]">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex min-h-11 items-center gap-3 rounded-lg text-copy transition-colors hover:text-evo-700 sm:min-h-0 sm:py-1.5"
                    >
                      <span className="font-display w-5 shrink-0 font-bold text-evo-600 tabular-nums">{index + 1}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <nav aria-label="Autres pages d'information" className="mt-4 hidden rounded-[1.5rem] bg-evo-50 p-6 lg:block">
              <h2 className="font-display text-lg font-bold text-ink">Confiance et données</h2>
              <ul className="mt-3 flex flex-col text-[0.9375rem]">
                {legalNav
                  .filter((item) => item.href !== path)
                  .map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-lg py-1.5 font-bold text-evo-700 hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="min-w-0 lg:col-span-8">
          {summary ? (
            <div className="mb-10 rounded-[1.5rem] bg-navy-900 p-6 text-white sm:p-8">
              <h2 className="font-display text-xl font-bold">En bref</h2>
              <ul className="mt-4 flex flex-col gap-3 text-haze">
                {summary.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="prose-evo">
            {sections.map((section, index) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id} className={index === 0 ? "!mt-0" : undefined}>
                  {index + 1}. {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-line-soft pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md font-bold text-evo-700 hover:underline">
              <ArrowLeft weight="bold" className="size-4" aria-hidden />
              Retour à l&apos;accueil
            </Link>
            <p className="text-[0.9375rem] text-muted">
              Une question ?{" "}
              <a href={`mailto:${site.contact.email}`} className="font-bold text-evo-700 underline underline-offset-4">
                {site.contact.email}
              </a>
            </p>
          </div>
        </article>
      </div>

      <JsonLd data={breadcrumb(title, path)} />
    </>
  );
}
