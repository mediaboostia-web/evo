"use client";

import { CircleHalf, Pause, SpeakerHigh, Stop, TextAa } from "@phosphor-icons/react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Prefs = { text?: boolean; contrast?: boolean; motion?: boolean };

const storageKey = "evo-a11y";
const listeners = new Set<() => void>();
let cache: { raw: string | null; prefs: Prefs } = { raw: null, prefs: {} };
const empty: Prefs = {};

function read(): Prefs {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(storageKey);
  } catch {
    // Stockage indisponible (navigation privée) : les réglages valent pour la visite en cours.
    return cache.prefs;
  }
  if (raw !== cache.raw) {
    try {
      cache = { raw, prefs: raw ? (JSON.parse(raw) as Prefs) : {} };
    } catch {
      cache = { raw, prefs: {} };
    }
  }
  return cache.prefs;
}

function write(prefs: Prefs) {
  const root = document.documentElement;
  const set = (name: string, value: string, on?: boolean) =>
    on ? root.setAttribute(name, value) : root.removeAttribute(name);
  set("data-text", "large", prefs.text);
  set("data-contrast", "high", prefs.contrast);
  set("data-motion", "reduced", prefs.motion);
  const raw = JSON.stringify(prefs);
  cache = { raw, prefs };
  try {
    window.localStorage.setItem(storageKey, raw);
  } catch {
    // Voir plus haut.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 text-[0.9375rem] font-bold transition-colors duration-200 active:scale-[0.98]",
        pressed
          ? "border-cyan bg-cyan text-navy-950"
          : "border-white/25 text-white hover:border-white/60 hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

/**
 * « Cette page tient la même promesse » : le visiteur règle la page à ses besoins,
 * et le réglage est conservé pour ses prochaines visites (stockage local, aucun cookie).
 */
export function A11yPanel({ readText }: { readText: string }) {
  const prefs = useSyncExternalStore(subscribe, read, () => empty);
  const [canSpeak, setCanSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    // La synthèse vocale n'existe que dans le navigateur : on ne montre le bouton qu'une fois vérifiée.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanSpeak("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const toggle = (key: keyof Prefs) => write({ ...prefs, [key]: !prefs[key] });

  const speak = () => {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(readText);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      <Toggle pressed={Boolean(prefs.text)} onClick={() => toggle("text")}>
        <TextAa weight="bold" className="size-5" aria-hidden />
        Texte plus grand
      </Toggle>
      <Toggle pressed={Boolean(prefs.contrast)} onClick={() => toggle("contrast")}>
        <CircleHalf weight="fill" className="size-5" aria-hidden />
        Contraste renforcé
      </Toggle>
      <Toggle pressed={Boolean(prefs.motion)} onClick={() => toggle("motion")}>
        <Pause weight="fill" className="size-5" aria-hidden />
        Moins d&apos;animations
      </Toggle>
      {canSpeak ? (
        <Toggle pressed={speaking} onClick={speak}>
          {speaking ? (
            <Stop weight="fill" className="size-5" aria-hidden />
          ) : (
            <SpeakerHigh weight="fill" className="size-5" aria-hidden />
          )}
          {speaking ? "Arrêter la lecture" : "Écouter ce passage"}
        </Toggle>
      ) : null}
    </div>
  );
}
