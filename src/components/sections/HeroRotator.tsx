"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { heroLines } from "@/lib/content";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

/**
 * Les situations où un élève se retrouve seul, une par une.
 * Les lecteurs d'écran reçoivent toutes les phrases d'un coup, sans animation.
 */
export function HeroRotator() {
  const reduced = useReducedMotionPref();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % heroLines.length), 3200);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const line = heroLines[reduced ? 0 : index];

  return (
    <p className="font-display relative mt-5 min-h-[2.5em] text-[clamp(1.25rem,1rem+1.1vw,1.875rem)] leading-[1.25] font-semibold tracking-tight text-cyan sm:min-h-[1.25em]">
      <span className="sr-only">{heroLines.join(" ")}</span>
      <span aria-hidden className="block overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={line}
            className="block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
