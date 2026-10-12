import { ClosedCaptioning, DotsSix, HandWaving, SpeakerHigh } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { A11yPanel } from "@/components/sections/A11yPanel";
import { accessibilityTools } from "@/lib/content";

const icons = {
  captions: ClosedCaptioning,
  sign: HandWaving,
  voice: SpeakerHigh,
  braille: DotsSix,
} as const;

const lead =
  "Un élève sourd ou malvoyant a le même droit de comprendre. Evo intègre quatre outils dès sa conception, pas en option.";

const readText = [
  "Pensé d'abord pour les élèves que l'on oublie.",
  lead,
  ...accessibilityTools.map((tool) => `${tool.title}. ${tool.text}`),
].join(" ");

/**
 * L'avantage décisif d'Evo, sur scène sombre pour marquer le changement de chapitre.
 * La section se termine par une preuve : la page elle-même s'adapte au visiteur.
 */
export function Accessibility() {
  return (
    <section id="accessibilite" aria-labelledby="accessibilite-title" className="scroll-mt-24 px-2 sm:px-3">
      <div className="on-dark relative isolate overflow-hidden rounded-[2rem] bg-navy-900 text-white md:rounded-[3rem]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_100%_0%,rgb(0_103_255/0.42),transparent_70%),radial-gradient(40%_40%_at_0%_100%,rgb(58_216_251/0.14),transparent_70%)]"
        />
        <div aria-hidden className="bg-dots absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_55%)]" />

        <div className="container-page section-y">
          <div data-reveal="up" className="max-w-3xl">
            <p className="text-eyebrow text-cyan">Une première au Gabon</p>
            <h2 id="accessibilite-title" className="text-h2 mt-5">
              Pensé d&apos;abord pour les élèves que l&apos;on oublie.
            </h2>
            <p className="text-lead mt-5 text-haze">{lead}</p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-5">
            {accessibilityTools.map((tool, index) => {
              const Icon = icons[tool.key];
              return (
                <li
                  key={tool.key}
                  data-reveal="up"
                  style={{ "--i": index } as CSSProperties}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-7"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-cyan/15 text-cyan">
                    <Icon weight="duotone" className="size-7" aria-hidden />
                  </span>
                  <h3 className="font-display mt-6 text-[1.375rem] leading-tight font-bold tracking-tight">{tool.title}</h3>
                  <p className="mt-2.5 text-haze">{tool.text}</p>
                </li>
              );
            })}
          </ul>

          <div
            data-reveal="up"
            className="mt-4 grid gap-6 rounded-[1.5rem] bg-white/[0.08] p-6 sm:p-8 lg:mt-5 lg:grid-cols-12 lg:items-center lg:gap-8"
          >
            <div className="lg:col-span-5">
              <h3 className="text-h3">Cette page tient la même promesse.</h3>
              <p className="mt-2.5 text-haze">
                Police conçue pour les lecteurs malvoyants, contrastes vérifiés, navigation au clavier. Essayez.
              </p>
            </div>
            <div className="lg:col-span-7 lg:justify-self-end">
              <A11yPanel readText={readText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
