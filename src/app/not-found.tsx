import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-evo-50">
      <div className="container-page flex min-h-[100dvh] flex-col items-center justify-center py-32 text-center">
        <span className="flex size-28 items-center justify-center overflow-hidden rounded-[2rem] bg-[#ebf3fe] shadow-card">
          <Image src="/brand/evo-mascot.png" alt="" width={240} height={280} sizes="112px" className="h-24 w-auto" />
        </span>
        <p className="text-eyebrow mt-8 text-evo-700">Erreur 404</p>
        <h1 className="text-h2 mt-4 max-w-2xl">Cette page a séché le cours.</h1>
        <p className="text-lead mt-5 max-w-xl text-copy">
          L&apos;adresse est peut-être incomplète, ou la page a été déplacée. Evo, lui, est toujours là.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">
            Retour à l&apos;accueil
            <ArrowRight
              weight="bold"
              className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden
            />
          </ButtonLink>
          <ButtonLink href="/#contact" variant="outline">
            Réserver ma place
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
