import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Blanc sur bleu #0067ff : 4,8:1
  primary: "bg-evo-600 text-white shadow-glow hover:bg-evo-700",
  light: "bg-white text-ink hover:bg-evo-100",
  outline: "border border-line bg-white text-ink hover:border-ink",
  // Sur scène sombre uniquement
  ghost: "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.9375rem]",
  lg: "min-h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "lg", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

/** Lien présenté comme un bouton. Les liens externes s'ouvrent via une balise <a> classique. */
export function ButtonLink({ variant, size, className, children, href, ...rest }: ButtonLinkProps) {
  const classes = buttonClass(variant, size, className);
  const url = typeof href === "string" ? href : "";
  if (/^(https?:|mailto:|tel:)/.test(url)) {
    const external = url.startsWith("http");
    return (
      <a
        href={url}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
