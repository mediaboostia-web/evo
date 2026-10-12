import { ArrowRight, EyeSlash, HandCoins, HourglassMedium, UsersFour } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { CountUp } from "@/components/ui/CountUp";
import { problems } from "@/lib/content";

const icons = [UsersFour, HandCoins, HourglassMedium, EyeSlash];

/**
 * Le constat : on part de ce que vit le parent, pas du produit.
 * Chaque difficulté est suivie, sur la même carte, de la réponse d'Evo.
 */
export function Problem() {
  return (
    <section id="problematique" aria-labelledby="problematique-title" className="section-y scroll-mt-10 bg-evo-50">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="problematique-title" data-reveal="up" className="text-h2">
              Votre enfant va à l&apos;école. Mais qui l&apos;aide en rentrant ?
            </h2>

            <div data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-10 md:mt-12">
              <p className="font-display flex items-start leading-[0.82] font-extrabold tracking-[-0.05em] text-evo-600">
                <CountUp to={90} className="text-[clamp(6rem,3rem+13vw,12.5rem)] tabular-nums" />
                <span className="mt-[0.12em] ml-1 text-[clamp(2.5rem,1.4rem+4.6vw,5rem)] tracking-normal">%</span>
              </p>
              <p className="text-lead mt-5 max-w-md text-copy">
                des enfants gabonais sont scolarisés au primaire. L&apos;accès à l&apos;école est là.{" "}
                <strong className="text-ink">L&apos;accompagnement, pas toujours.</strong>
              </p>
              <p className="mt-3 text-sm text-muted">Taux de scolarisation au primaire, Gabon.</p>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
          {problems.map((problem, index) => {
            const Icon = icons[index];
            return (
              <li
                key={problem.title}
                data-reveal="up"
                style={{ "--i": index % 2 } as CSSProperties}
                className="rounded-[1.5rem] bg-white p-6 shadow-card sm:p-8 md:rounded-[2rem]"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-evo-100 text-evo-700 sm:size-14">
                    <Icon weight="duotone" className="size-6 sm:size-7" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-h3">{problem.title}</h3>
                    <p className="mt-2 text-copy">{problem.text}</p>
                  </div>
                </div>
                <p className="mt-6 flex items-center gap-3 border-t border-line-soft pt-5 font-bold text-evo-700">
                  <ArrowRight weight="bold" className="size-5 shrink-0" aria-hidden />
                  {problem.answer}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
