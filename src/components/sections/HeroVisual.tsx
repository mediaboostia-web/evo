"use client";

import { Check, ClosedCaptioning } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

function Chip({ className, i, children }: { className?: string; i: number; children: ReactNode }) {
  return (
    <div
      className={cn(
        "animate-rise absolute z-20 flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pr-4 pl-2.5 text-[0.8125rem] leading-tight font-bold whitespace-nowrap text-ink shadow-float sm:text-sm",
        className,
      )}
      style={{ animationDelay: `${500 + i * 140}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * L'écran d'accueil de l'app, entouré de trois preuves concrètes :
 * une notion comprise, les sous-titres, la lecture à voix haute.
 * Au défilement, les plans se décalent légèrement pour donner de la profondeur.
 */
export function HeroVisual({ className }: { className?: string }) {
  const reduced = useReducedMotionPref();
  const { scrollY } = useScroll();
  const phoneY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : -36]);
  const frontY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : -84]);
  const ringScale = useTransform(scrollY, [0, 700], [1, reduced ? 1 : 1.12]);

  return (
    <div className={cn("relative mx-auto w-full max-w-[21rem] sm:max-w-[25rem] lg:max-w-[27rem]", className)}>
      {/* Halo et orbites : l'écho du « e » du logo */}
      <motion.div aria-hidden style={{ scale: ringScale }} className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="absolute aspect-square w-[118%] rounded-full bg-[radial-gradient(circle,rgb(20_159_244/0.5),rgb(0_103_255/0.18)_45%,transparent_68%)]" />
        <div className="absolute aspect-square w-[96%] rounded-full border border-white/10" />
        <div className="absolute aspect-square w-[128%] rounded-full border border-white/[0.07]" />
      </motion.div>

      <motion.div style={{ y: phoneY }} className="relative z-10 mx-auto w-[66%]">
        <div className="animate-rise" style={{ animationDelay: "200ms" }}>
          <Image
            src="/brand/evo-app-phone.png"
            alt="L'écran d'accueil de l'application Evo sur un téléphone : la mascotte et le bouton Commencer."
            width={471}
            height={843}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 264px, 222px"
            className="h-auto w-full drop-shadow-[0_40px_50px_rgb(2_6_23/0.55)]"
          />
        </div>
      </motion.div>

      <motion.div style={{ y: frontY }} className="absolute inset-0">
        <Chip i={0} className="top-[14%] left-0">
          <span className="flex size-8 items-center justify-center rounded-full bg-ok-soft text-ok">
            <Check weight="bold" className="size-4" aria-hidden />
          </span>
          Fractions : compris
        </Chip>
        <Chip i={1} className="top-[47%] right-0">
          <span className="flex size-8 items-center justify-center rounded-full bg-evo-100 text-evo-700">
            <ClosedCaptioning weight="fill" className="size-[1.125rem]" aria-hidden />
          </span>
          Sous-titres activés
        </Chip>
        <Chip i={2} className="bottom-[13%] left-[2%]">
          <span aria-hidden className="flex size-8 items-center justify-center gap-[3px] rounded-full bg-navy-900">
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className="animate-wave h-3.5 w-[3px] origin-center rounded-full bg-cyan"
                style={{ animationDelay: `${bar * 140}ms` }}
              />
            ))}
          </span>
          Lecture à voix haute
        </Chip>
      </motion.div>
    </div>
  );
}
