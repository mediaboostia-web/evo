import Image from "next/image";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * Logo officiel (fond transparent), jamais recoloré.
 * À utiliser sur fond clair uniquement : le mot « vo » est bleu nuit.
 */
export function Logo({ className, eager = false }: { className?: string; eager?: boolean }) {
  return (
    <Image
      src="/brand/evo-logo.png"
      alt={site.fullName}
      width={176}
      height={133}
      loading={eager ? "eager" : "lazy"}
      sizes="80px"
      className={cn("h-[3.25rem] w-auto", className)}
    />
  );
}

/** Version pour scène sombre : la mascotte détourée et le nom composé en texte. */
export function LogoOnDark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/brand/evo-mascot-cutout.png"
        alt=""
        width={240}
        height={280}
        sizes="56px"
        className="h-14 w-auto"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[2rem] font-extrabold tracking-tight text-white">évo</span>
        <span className="mt-1 text-sm text-haze">Mon répétiteur virtuel</span>
      </span>
    </span>
  );
}
