"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

/** Durée d'affichage de chaque étape de la conversation, en millisecondes. */
const timeline = [700, 1300, 2600, 1500];
const lastStep = timeline.length;

const bubble = "max-w-[88%] rounded-[1.25rem] px-4 py-3 text-[0.9375rem] leading-snug sm:text-base";
const enter = "transition-[opacity,transform] duration-500 ease-out";
const hidden = "pointer-events-none translate-y-2 opacity-0";

/**
 * Une vraie mini-conversation, jouée quand elle entre à l'écran :
 * l'élève bloque, Evo reformule avec un exemple du quotidien.
 */
export function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduced = useReducedMotionPref();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduced || step >= lastStep) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), timeline[step]);
    return () => window.clearTimeout(timer);
  }, [inView, reduced, step]);

  const current = reduced ? lastStep : step;
  const shown = (at: number) => current >= at;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustration d'une conversation. L'élève : je ne comprends pas les fractions. Evo : imagine un bâton de manioc coupé en 4 parts égales. Tu en manges 1 : tu as mangé un quart du bâton. L'élève : ah, et si j'en mange 3 ?"
      className="rounded-[1.5rem] bg-white p-4 shadow-card sm:p-5"
    >
      <div aria-hidden>
        <div className="flex items-center gap-3 border-b border-line-soft pb-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ebf3fe]">
            <Image src="/brand/evo-mascot.png" alt="" width={240} height={280} sizes="40px" className="h-9 w-auto" />
          </span>
          <p className="leading-tight font-bold text-ink">
            Evo
            <span className="block text-sm font-normal text-muted">Mathématiques</span>
          </p>
        </div>

        <div className="flex min-h-[17.5rem] flex-col justify-end gap-2.5 pt-4 sm:min-h-[16.5rem]">
          <p className={cn(bubble, enter, "self-end rounded-br-md bg-evo-600 text-white", !shown(1) && hidden)}>
            Je ne comprends pas les fractions.
          </p>

          <div className="relative max-w-[88%] self-start">
            {/* Evo « écrit » : les points occupent la place de la réponse à venir, sans décaler la conversation. */}
            {current === 2 ? (
              <p className="absolute top-0 left-0 flex items-center gap-1.5 rounded-[1.25rem] rounded-bl-md bg-evo-50 px-4 py-4">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="animate-dot size-2 rounded-full bg-evo-600"
                    style={{ animationDelay: `${dot * 160}ms` }}
                  />
                ))}
              </p>
            ) : null}
            <div className={cn(bubble, enter, "max-w-none rounded-bl-md bg-evo-50 text-ink", !shown(3) && hidden)}>
              <p>
                Imagine un bâton de manioc coupé en 4 parts égales. Tu en manges 1 : tu as mangé <strong>1/4</strong> du bâton.
              </p>
              <span className="mt-3 flex gap-1">
                {[0, 1, 2, 3].map((part) => (
                  <span
                    key={part}
                    className={cn("h-3 flex-1 rounded-full", part === 0 ? "bg-evo-600" : "bg-evo-200")}
                  />
                ))}
              </span>
            </div>
          </div>

          <p className={cn(bubble, enter, "self-end rounded-br-md bg-evo-600 text-white", !shown(4) && hidden)}>
            Ahh ! Et si j&apos;en mange 3 ?
          </p>
        </div>

        <ul className={cn(enter, "mt-4 flex flex-wrap gap-2", !shown(4) && hidden)}>
          {["J'ai compris", "Encore un exemple", "Montre-moi un dessin"].map((reply) => (
            <li
              key={reply}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm font-bold text-evo-700"
            >
              {reply}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
