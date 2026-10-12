"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  // Le visiteur peut aussi couper les animations depuis le panneau d'accessibilité.
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

const getSnapshot = () =>
  window.matchMedia(query).matches || document.documentElement.dataset.motion === "reduced";

/** Vrai si le système ou le visiteur demande de réduire les animations. */
export function useReducedMotionPref() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
