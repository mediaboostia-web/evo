import { ArrowRight, Play } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { HeroRotator } from "@/components/sections/HeroRotator";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { ButtonLink } from "@/components/ui/Button";
import { stats } from "@/lib/content";

const delay = (i: number) => ({ animationDelay: `${i * 90}ms` }) as CSSProperties;

export function Hero() {
  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="on-dark relative isolate overflow-hidden rounded-b-[2rem] bg-navy-900 text-white md:rounded-b-[3rem]"
      >
        {/* Lumière de scène : dégradés peints une seule fois, sans flou coûteux */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_82%_30%,rgb(0_103_255/0.5),transparent_70%),radial-gradient(45%_50%_at_0%_100%,rgb(58_216_251/0.16),transparent_70%),linear-gradient(180deg,#070614_0%,#0a1230_45%,#0d1a47_100%)]"
        />
        <div
          aria-hidden
          className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_65%_at_30%_35%,black,transparent)]"
        />

        <div className="container-page grid items-center gap-x-6 gap-y-14 pt-30 pb-36 sm:pt-34 lg:grid-cols-12 lg:pt-40 lg:pb-44">
          <div className="lg:col-span-7">
            <p
              className="text-eyebrow animate-rise inline-flex items-center rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-cyan"
              style={delay(0)}
            >
              Le premier répétiteur IA inclusif du Gabon
            </p>
            <h1 id="hero-title" className="text-display animate-rise mt-6 lg:text-[length:clamp(3.5rem,0.2rem+5.6vw,5.25rem)]" style={delay(1)}>
              Un répétiteur <span className="block">pour chaque élève.</span>
            </h1>
            <div className="animate-rise" style={delay(2)}>
              <HeroRotator />
            </div>
            <p className="text-lead animate-rise mt-5 max-w-[34rem] text-haze" style={delay(3)}>
              Evo explique, fait pratiquer et corrige les devoirs de votre enfant. À son rythme, du primaire au lycée.
            </p>
            <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={delay(4)}>
              <ButtonLink href="/#contact">
                Réserver ma place
                <ArrowRight
                  weight="bold"
                  className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-1"
                  aria-hidden
                />
              </ButtonLink>
              <ButtonLink href="/#film" variant="ghost">
                <Play weight="fill" className="size-4" aria-hidden />
                Voir Evo en 90 secondes
              </ButtonLink>
            </div>
          </div>

          <HeroVisual className="lg:col-span-5" />
        </div>
      </section>

      {/* Quatre repères concrets, à cheval sur le héros. Entrée en CSS pur : visible sans attendre JavaScript. */}
      <div className="container-page relative z-10 -mt-20 md:-mt-24">
        <dl
          style={delay(5)}
          className="animate-rise grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-line-soft bg-white shadow-float md:rounded-[2rem] lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const [figure, ...unit] = stat.value.split(" ");
            return (
              <div
                key={stat.value}
                className={[
                  "flex flex-col-reverse justify-end gap-2 p-5 sm:p-7 lg:p-8",
                  index % 2 === 1 ? "border-l border-line-soft" : "",
                  index >= 2 ? "border-t border-line-soft lg:border-t-0" : "",
                  index === 2 ? "lg:border-l" : "",
                ].join(" ")}
              >
                <dt className="text-[0.9375rem] leading-snug text-muted sm:text-base">{stat.label}</dt>
                <dd className="font-display flex flex-wrap items-baseline gap-x-1.5 leading-none font-extrabold tracking-tight text-ink">
                  <span className="text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)]">{figure}</span>
                  <span className="text-[clamp(1.0625rem,0.9rem+0.7vw,1.5rem)] text-evo-600">{unit.join(" ")}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </>
  );
}
