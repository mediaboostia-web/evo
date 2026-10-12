"use client";

import { ArrowRight, List, WhatsappLogo, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mainNav, site, whatsappLink } from "@/lib/site";

/** Identifiant de section correspondant à un lien « /#ancre ». */
const sectionId = (href: string) => href.split("#")[1] ?? "";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [raised, setRaised] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Ombre de l'en-tête dès que la page a défilé (sentinelle, pas d'écouteur de scroll).
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setRaised(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Lien actif : la section qui occupe le milieu de l'écran.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = mainNav
      .map((item) => document.getElementById(sectionId(item.href)))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { id } = entry.target;
          if (entry.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? "" : current));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Menu mobile : verrouille le défilement, ferme avec Échap, rend le reste de la page inerte.
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("contenu");
    const footer = document.getElementById("pied-de-page");
    document.documentElement.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Repasser en grand écran referme le menu mobile.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const isActive = (href: string) => pathname === "/" && active === sectionId(href);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute top-0 h-6 w-px" />
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            "mx-auto flex h-[4.25rem] max-w-[76rem] items-center justify-between gap-2 rounded-full border bg-white/90 pr-2.5 pl-4 backdrop-blur-xl transition-shadow duration-300 sm:pl-6",
            raised || open ? "border-line-soft shadow-card" : "border-white/60 shadow-none",
          )}
        >
          <Link
            href="/"
            aria-label={`${site.fullName} : retour à l'accueil`}
            className="flex shrink-0 items-center rounded-full"
            onClick={() => setOpen(false)}
          >
            <Logo eager />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "true" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[0.9375rem] font-bold transition-colors duration-200 xl:px-4",
                      isActive(item.href)
                        ? "bg-evo-100 text-evo-800"
                        : "text-copy hover:bg-evo-50 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/#contact"
              className={buttonClass("primary", "md", "shadow-none max-[359px]:hidden max-[419px]:px-4")}
              onClick={() => setOpen(false)}
            >
              Réserver ma place
              <ArrowRight
                weight="bold"
                className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 max-[419px]:hidden"
                aria-hidden
              />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full bg-evo-50 text-ink transition-colors hover:bg-evo-100 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X weight="bold" className="size-5" aria-hidden /> : <List weight="bold" className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-white px-5 pt-28 pb-10 lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="mx-auto flex min-h-full max-w-md flex-col">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line-soft">
                <Link
                  href={item.href}
                  className="font-display flex items-center justify-between py-4 text-[1.75rem] leading-tight font-bold tracking-tight text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <ArrowRight weight="bold" className="size-5 text-evo-600" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Link
              href="/#contact"
              className={buttonClass("primary", "lg", "w-full")}
              onClick={() => setOpen(false)}
            >
              Réserver ma place
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("outline", "lg", "w-full")}
            >
              <WhatsappLogo weight="fill" className="size-5 text-ok" aria-hidden />
              {site.contact.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
