import { Check, DeviceMobile, DeviceTablet, Laptop, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ChatDemo } from "@/components/demos/ChatDemo";
import { QuizDemo } from "@/components/demos/QuizDemo";
import { cn } from "@/lib/cn";

const subjects = [
  { name: "Maths", value: 72 },
  { name: "SVT", value: 81 },
  { name: "Français", value: 48 },
];

function Points({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className={cn("mt-5 flex flex-col gap-2.5", dark ? "text-haze" : "text-copy")}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full",
              dark ? "bg-white/10 text-cyan" : "bg-evo-100 text-evo-700",
            )}
          >
            <Check weight="bold" className="size-3.5" aria-hidden />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Tile({ className, i = 0, children }: { className?: string; i?: number; children: ReactNode }) {
  return (
    <article
      data-reveal="up"
      style={{ "--i": i } as CSSProperties}
      className={cn("relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8 md:rounded-[2.25rem] lg:p-10", className)}
    >
      {children}
    </article>
  );
}

const note = "mt-3 text-center text-[0.8125rem] font-bold tracking-wide uppercase";

/**
 * Ce qu'Evo fait, en trois gestes : expliquer, faire pratiquer, corriger et suivre.
 * Chaque geste est montré par une mini-interface réelle plutôt que décrit.
 */
export function Solution() {
  return (
    <section id="solution" aria-labelledby="solution-title" className="section-y scroll-mt-10">
      <div className="container-page">
        <div data-reveal="up" className="max-w-3xl">
          <h2 id="solution-title" className="text-h2">
            Ce qu&apos;un bon répétiteur fait. <span className="text-evo-600">Pour tous.</span>
          </h2>
          <p className="text-lead mt-5 text-copy">
            Expliquer. Faire pratiquer. Corriger et suivre. Trois gestes, faits avec patience, à toute heure.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-12 lg:gap-5">
          {/* 1. Il explique */}
          <Tile className="bg-evo-50 lg:col-span-7">
            <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-1 xl:grid-cols-[5fr_6fr] xl:gap-8">
              <div>
                <h3 className="text-h3">Il explique autrement, jusqu&apos;à ce que ce soit compris.</h3>
                <p className="mt-3 text-copy">
                  Pas compris la leçon ? Evo reformule avec des exemples de tous les jours, autant de fois qu&apos;il le faut.
                </p>
                <Points
                  items={[
                    "Des exemples tirés du quotidien de l'élève",
                    "Aucune question n'est « bête »",
                    "Disponible 24 h/24",
                  ]}
                />
              </div>
              <div>
                <ChatDemo />
                <p className={cn(note, "text-muted")}>Illustration</p>
              </div>
            </div>
          </Tile>

          {/* 2. Il fait pratiquer */}
          <Tile i={1} className="on-dark bg-navy-900 text-white lg:col-span-5">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgb(0_103_255/0.45),transparent_70%)]"
            />
            <div className="relative">
              <h3 className="text-h3">Trop facile ? Ça monte. Trop dur ? Ça redescend.</h3>
              <p className="mt-3 text-haze">
                Les exercices s&apos;adaptent à chaque réponse. Assez durs pour progresser, jamais au point de décourager.
              </p>
              <div className="mt-7">
                <QuizDemo />
              </div>
            </div>
          </Tile>

          {/* 3. Il corrige et vous informe */}
          <Tile className="border border-line-soft bg-white lg:col-span-5">
            <h3 className="text-h3">Vous savez enfin où en est votre enfant.</h3>
            <p className="mt-3 text-copy">
              Evo corrige les devoirs et vous montre, matière par matière, ce qui est acquis et ce qui bloque.
            </p>

            <div
              role="img"
              aria-label="Illustration du tableau de bord parent. Progrès de Grâce cette semaine : mathématiques 72 %, SVT 81 %, français 48 %. À revoir : le passé composé, 3 erreurs cette semaine, Evo a préparé 5 exercices."
              className="mt-7 rounded-[1.5rem] bg-evo-50 p-4 sm:p-5"
            >
              <div aria-hidden>
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-bold text-ink">Progrès de Grâce</span>
                  <span className="text-sm text-muted">Cette semaine</span>
                </p>
                <ul className="mt-4 flex flex-col gap-3.5">
                  {subjects.map((subject) => (
                    <li key={subject.name} className="grid grid-cols-[5.25rem_1fr_3rem] items-center gap-3 text-[0.9375rem]">
                      <span className="font-bold text-ink">{subject.name}</span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-white">
                        <span
                          className={cn(
                            "bar-fill block h-full origin-left rounded-full",
                            subject.value < 50 ? "bg-sky" : "bg-evo-600",
                          )}
                          style={{ "--v": subject.value / 100 } as CSSProperties}
                        />
                      </span>
                      <span className="font-display text-right font-bold text-ink tabular-nums">{subject.value} %</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-3.5 text-[0.9375rem] leading-snug text-copy">
                  <WarningCircle weight="fill" className="mt-0.5 size-5 shrink-0 text-evo-600" />
                  <span>
                    <strong className="text-ink">À revoir : le passé composé.</strong> 3 erreurs cette semaine. Evo a préparé 5
                    exercices.
                  </span>
                </p>
              </div>
            </div>
            <p className={cn(note, "text-muted")}>Données d&apos;illustration</p>
          </Tile>

          {/* 4. Partout, tout le temps */}
          <Tile i={1} className="on-dark flex min-h-[24rem] items-end bg-navy-900 text-white lg:col-span-7">
            <Image
              src="/images/eleve-etudie-bureau.jpg"
              alt="Une élève travaille à son bureau à la maison, son cahier ouvert à côté d'un ordinateur portable."
              fill
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 94vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_6_20/0)_25%,rgb(7_6_20/0.55)_58%,rgb(7_6_20/0.92)_100%)]"
            />
            <div className="relative max-w-xl">
              <h3 className="text-h3">Le téléphone de la maison suffit.</h3>
              <p className="mt-3 text-white/85">
                À la maison, chez un proche, pendant la pause. Evo suit votre enfant là où il est.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
                {[
                  { label: "Téléphone", Icon: DeviceMobile },
                  { label: "Tablette", Icon: DeviceTablet },
                  { label: "Ordinateur", Icon: Laptop },
                ].map(({ label, Icon }) => (
                  <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 backdrop-blur-md">
                    <Icon weight="fill" className="size-4" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
