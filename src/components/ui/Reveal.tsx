import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  /** Rang dans une liste : décale l'entrée de 80 ms par élément, dans l'ordre de lecture. */
  i?: number;
  variant?: "up" | "scale";
  className?: string;
  children: ReactNode;
  id?: string;
};

/**
 * Entrée au défilement. Composant serveur : il ne pose que des attributs,
 * l'observation est faite une seule fois pour toute la page par <RevealObserver />.
 */
export function Reveal({ as: Tag = "div", i = 0, variant = "up", className, children, id }: RevealProps) {
  return (
    <Tag
      id={id}
      data-reveal={variant}
      className={className}
      style={i ? ({ "--i": i } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
