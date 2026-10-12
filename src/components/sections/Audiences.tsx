"use client";

import { ArrowRight, Check } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { audiences } from "@/lib/content";

/**
 * « Est-ce pour moi ? » : parent, élève ou école, chacun se reconnaît.
 * Onglets accessibles (flèches du clavier). Les trois contenus restent dans le HTML,
 * donc lisibles par les moteurs de recherche.
 */
export function Audiences() {
  const [active, setActive] = useState(0);
  // Le premier rendu (serveur) est affiché tel quel ; l'entrée animée ne joue qu'aux changements d'onglet.
  const [touched, setTouched] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = audiences.length - 1;
    let next = active;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    setTouched(true);
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="pour-qui" aria-labelledby="pour-qui-title" className="section-y scroll-mt-10">
      <div className="container-page">
        <div data-reveal="up" className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="pour-qui-title" className="text-h2 max-w-2xl">
            Un seul outil, trois façons de le vivre.
          </h2>

          <div
            role="tablist"
            aria-label="Choisir un profil"
            onKeyDown={onKeyDown}
            className="-mx-1 flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-evo-50 p-1.5 [scrollbar-width:none] lg:self-auto"
          >
            {audiences.map((audience, index) => (
              <button
                key={audience.key}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${audience.key}`}
                aria-selected={active === index}
                aria-controls={`${id}-panel-${audience.key}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => {
                  setTouched(true);
                  setActive(index);
                }}
                className={cn(
                  "relative min-h-11 shrink-0 rounded-full px-4 text-[0.9375rem] font-bold whitespace-nowrap transition-colors duration-200 sm:px-5",
                  active === index ? "text-white" : "text-copy hover:text-ink",
                )}
              >
                {active === index ? (
                  <motion.span
                    layoutId={`${id}-pill`}
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                ) : null}
                <span className="relative">{audience.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          {audiences.map((audience, index) => (
            <div
              key={audience.key}
              role="tabpanel"
              id={`${id}-panel-${audience.key}`}
              aria-labelledby={`${id}-tab-${audience.key}`}
              hidden={active !== index}
              tabIndex={0}
              className="rounded-[2rem]"
            >
              <motion.div
                key={active}
                initial={touched ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid overflow-hidden rounded-[1.75rem] bg-evo-50 md:rounded-[2.25rem] lg:grid-cols-2"
              >
                <div className="relative aspect-[4/3] bg-evo-100 lg:aspect-auto lg:min-h-[32rem]">
                  <Image
                    src={audience.image}
                    alt={audience.alt}
                    fill
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 94vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                  <h3 className="font-display text-[clamp(1.625rem,1.2rem+1.6vw,2.5rem)] leading-[1.08] font-bold tracking-[-0.025em] text-balance">
                    {audience.title}
                  </h3>
                  <p className="text-lead mt-4 text-copy">{audience.text}</p>
                  <ul className="mt-6 flex flex-col gap-3 text-ink">
                    {audience.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-evo-600 text-white">
                          <Check weight="bold" className="size-3.5" aria-hidden />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href={audience.cta.href} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
                      {audience.cta.label}
                      <ArrowRight
                        weight="bold"
                        className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
