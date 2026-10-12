"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

const statement =
  "Evo est une startup EdTech gabonaise. Notre mission est simple : rendre une éducation de qualité accessible à chaque élève, partout au Gabon, sans exception.";

/** Les mots qui portent la promesse restent en bleu une fois lus. */
const highlighted = new Set(["chaque", "élève,", "sans", "exception."]);

function Word({
  children,
  progress,
  range,
  accent,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span
      data-word
      style={{ opacity: reduced ? 1 : opacity }}
      className={accent ? "text-evo-600" : undefined}
    >
      {children}{" "}
    </motion.span>
  );
}

/**
 * « Qui sommes-nous » : la mission se lit mot à mot, au rythme du défilement.
 * Le mouvement sert la lecture : on ne peut pas survoler la phrase qui fonde le projet.
 */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = statement.split(" ");

  return (
    <section id="apropos" aria-labelledby="apropos-title" className="scroll-mt-24 pb-[clamp(4.5rem,9vw,9rem)]">
      <div className="container-page">
        <h2 id="apropos-title" className="text-eyebrow text-evo-700">
          Qui sommes-nous
        </h2>
        <p
          ref={ref}
          className="font-display mt-6 max-w-[62rem] text-[clamp(1.75rem,1.1rem+2.9vw,3.75rem)] leading-[1.1] font-bold tracking-[-0.03em] text-ink"
        >
          {words.map((word, index) => (
            <Word
              key={`${word}-${index}`}
              progress={scrollYProgress}
              range={[index / words.length, Math.min(1, (index + 1.5) / words.length)]}
              accent={highlighted.has(word)}
              reduced={reduced}
            >
              {word}
            </Word>
          ))}
        </p>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12 md:gap-5">
          <figure data-reveal="up" className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-evo-100 md:col-span-7 md:aspect-auto md:h-[26rem] md:rounded-[2rem] lg:h-[30rem]">
            <Image
              src="/images/eleve-revise-ordinateur.jpg"
              alt="Une collégienne en uniforme révise à la maison : son ordinateur ouvert, elle prend des notes dans son cahier."
              fill
              sizes="(min-width: 1280px) 700px, (min-width: 768px) 58vw, 94vw"
              className="object-cover"
            />
          </figure>
          <figure
            data-reveal="up"
            style={{ "--i": 1 } as CSSProperties}
            className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-evo-100 md:col-span-5 md:aspect-auto md:h-[26rem] md:rounded-[2rem] lg:h-[30rem]"
          >
            <Image
              src="/images/eleve-ecrit-cahier.jpg"
              alt="Gros plan sur les mains d'un élève qui résout un exercice de mathématiques dans son cahier."
              fill
              sizes="(min-width: 1280px) 500px, (min-width: 768px) 40vw, 94vw"
              className="object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
