"use client";

import { ClosedCaptioning, Play, Timer } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { site } from "@/lib/site";
import { useReducedMotionPref } from "@/lib/useReducedMotionPref";

const { video } = site;
const hasVideo = Boolean(video.mp4 || video.youtubeId);

const chip = "inline-flex items-center gap-2 rounded-full bg-evo-50 px-3 py-1.5 sm:bg-white/15 sm:backdrop-blur-md";

/**
 * Le film de présentation, au format 16:9, juste après le héros.
 * Le cadre grandit pendant qu'il entre à l'écran : le regard est conduit vers la lecture.
 * Rien n'est chargé (ni vidéo, ni lecteur YouTube) tant que le visiteur n'a pas appuyé sur lecture.
 */
export function Film() {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.86, 1]);

  return (
    <section id="film" aria-labelledby="film-title" className="section-y scroll-mt-20 overflow-hidden">
      <div className="container-page">
        <div data-reveal="up" className="mx-auto max-w-3xl text-center">
          <h2 id="film-title" className="text-h2">
            Evo en 60 secondes.
          </h2>
          <p className="text-lead mt-4 text-copy">Une question, une explication, un exercice. Regardez.</p>
        </div>

        <motion.div ref={frameRef} style={{ scale }} className="relative mt-10 origin-top md:mt-14">
          <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-navy-900 shadow-float sm:rounded-[2rem] lg:rounded-[2.5rem]">
            {playing && video.mp4 ? (
              <video
                className="absolute inset-0 size-full bg-night object-cover"
                src={video.mp4}
                poster={video.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
              >
                {video.captions ? (
                  <track kind="captions" src={video.captions} srcLang="fr" label="Français" default />
                ) : null}
              </video>
            ) : playing && video.youtubeId ? (
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&cc_load_policy=1&hl=fr`}
                title="Evo en 60 secondes : film de présentation"
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  src={video.poster}
                  alt="Une élève révise le soir à son bureau, éclairée par une lampe, devant son ordinateur."
                  fill
                  sizes="(min-width: 1280px) 1168px, 94vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_6_20/0.15)_0%,rgb(7_6_20/0.2)_45%,rgb(7_6_20/0.78)_100%)]"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center sm:gap-4">
                  {hasVideo ? (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="on-dark group flex size-18 items-center justify-center rounded-full bg-white text-evo-600 shadow-float transition-transform duration-300 ease-out hover:scale-108 active:scale-95 sm:size-24"
                      aria-label="Lire le film de présentation d'Evo (60 secondes, sous-titré)"
                    >
                      <Play weight="fill" className="size-7 translate-x-0.5 sm:size-9" aria-hidden />
                    </button>
                  ) : (
                    <>
                      <span
                        aria-hidden
                        className="flex size-16 items-center justify-center rounded-full bg-white text-evo-600 shadow-float sm:size-24"
                      >
                        <Play weight="fill" className="size-6 translate-x-0.5 sm:size-9" />
                      </span>
                      <p className="rounded-full bg-night/70 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm sm:text-base">
                        Film de présentation, bientôt disponible
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Repères du film : sous le cadre sur téléphone, posés sur l'image à partir de la tablette. */}
          {playing ? null : (
            <ul className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[0.8125rem] font-bold text-copy sm:absolute sm:bottom-7 sm:left-7 sm:mt-0 sm:justify-start sm:text-sm sm:text-white">
              <li className={chip}>
                <ClosedCaptioning weight="fill" className="size-4" aria-hidden />
                Sous-titré en français
              </li>
              <li className={chip}>
                <Timer weight="fill" className="size-4" aria-hidden />
                {video.durationLabel}
              </li>
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
