"use client";

import { ArrowCounterClockwise, Check, X } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const options = ["4/8", "1", "3/16", "4/4 + 1"];
const correct = 1;

/**
 * Un exercice que le visiteur peut vraiment essayer.
 * Une erreur n'affiche pas « faux » : elle déclenche une explication, comme le ferait Evo.
 */
export function QuizDemo() {
  const [picked, setPicked] = useState<number | null>(null);
  const solved = picked === correct;
  const missed = picked !== null && !solved;

  return (
    <div className="on-light rounded-[1.5rem] bg-white p-4 text-ink shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-3 text-sm font-bold">
        <p className="whitespace-nowrap text-muted">Exercice 4/10</p>
        <p className="flex items-center gap-2 whitespace-nowrap text-ink" aria-live="polite">
          Niveau {solved ? 3 : 2}
          <span aria-hidden className="flex gap-1">
            {[1, 2, 3].map((pip) => (
              <span
                key={pip}
                className={cn(
                  "h-2 w-5 rounded-full transition-colors duration-500",
                  pip <= (solved ? 3 : 2) ? "bg-evo-600" : "bg-evo-100",
                )}
              />
            ))}
          </span>
        </p>
      </div>

      <fieldset className="mt-4" disabled={solved}>
        <legend className="font-display text-[1.375rem] leading-tight font-bold tracking-tight sm:text-2xl">
          Combien font 3/4 + 1/4 ?
        </legend>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {options.map((option, index) => {
            const isPicked = picked === index;
            const isRight = isPicked && index === correct;
            const isWrong = isPicked && index !== correct;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isPicked}
                onClick={() => setPicked(index)}
                className={cn(
                  "font-display flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-3 text-lg font-bold transition-[background-color,border-color,transform] duration-200 active:scale-[0.97]",
                  isRight && "border-ok bg-ok-soft text-ok",
                  isWrong && "border-warn/40 bg-[#fdecea] text-warn",
                  !isPicked && "border-line-soft bg-evo-50 hover:border-evo-600 hover:bg-white",
                )}
              >
                {option}
                {isRight ? <Check weight="bold" className="size-5" aria-hidden /> : null}
                {isWrong ? <X weight="bold" className="size-5" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-3 min-h-[5.25rem] text-[0.9375rem] leading-snug">
        {solved ? (
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-ok-soft p-3.5 text-ok">
            <p>
              <strong>Bravo !</strong> 3/4 + 1/4 = 4/4, donc 1. Le niveau monte d&apos;un cran.
            </p>
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white"
              aria-label="Recommencer l'exercice"
            >
              <ArrowCounterClockwise weight="bold" className="size-4" aria-hidden />
            </button>
          </div>
        ) : missed ? (
          <p className="rounded-2xl bg-evo-50 p-3.5 text-copy">
            <strong className="text-ink">Pas tout à fait.</strong> Les deux fractions ont le même dénominateur : on additionne
            seulement les numérateurs. 3 + 1 = ? Réessayez.
          </p>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-3.5 text-muted">
            À vous : touchez une réponse pour voir comment Evo réagit.
          </p>
        )}
      </div>
    </div>
  );
}
