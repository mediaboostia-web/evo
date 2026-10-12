import { ChartLineUp, ChatCircleDots, EnvelopeSimple, PencilSimpleLine } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { steps } from "@/lib/content";

const icons = [PencilSimpleLine, EnvelopeSimple, ChatCircleDots, ChartLineUp];

/**
 * « Et après l'inscription ? » : quatre étapes, reliées par un fil.
 * Horizontal sur grand écran, vertical sur téléphone.
 */
export function Process() {
  return (
    <section id="etapes" aria-labelledby="etapes-title" className="section-y scroll-mt-10 bg-evo-50">
      <div className="container-page">
        <div data-reveal="up" className="mx-auto max-w-3xl text-center">
          <h2 id="etapes-title" className="text-h2">
            De l&apos;inscription au premier « j&apos;ai compris ».
          </h2>
          <p className="text-lead mt-5 text-copy">Quatre étapes. Aucune ne demande plus d&apos;une minute de votre temps.</p>
        </div>

        <ol className="relative mt-12 grid gap-10 md:mt-16 lg:grid-cols-4 lg:gap-6">
          {/* Le fil qui relie les étapes */}
          <span
            aria-hidden
            className="absolute top-7 bottom-7 left-7 w-px bg-[linear-gradient(180deg,var(--color-evo-600),var(--color-cyan))] lg:top-7 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto lg:bg-[linear-gradient(90deg,var(--color-evo-600),var(--color-cyan))]"
          />
          {steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <li
                key={step.title}
                data-reveal="up"
                style={{ "--i": index } as CSSProperties}
                className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center"
              >
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-evo-600 text-white shadow-glow ring-8 ring-evo-50">
                  <Icon weight="fill" className="size-6" aria-hidden />
                </span>
                <div className="pt-1 lg:pt-0">
                  <h3 className="font-display text-[1.375rem] leading-tight font-bold tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-2 text-copy lg:mx-auto lg:max-w-[16rem]">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
