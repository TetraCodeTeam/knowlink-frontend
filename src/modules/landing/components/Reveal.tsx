import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/modules/landing/hooks/useInView";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";

interface RevealProps {
  children: ReactNode;
  /** Retraso en pasos de 90 ms, para escalonar elementos hermanos. */
  delay?: number;
  className?: string;
}

/** Hace aparecer a su contenido (con un leve desplazamiento) la primera vez que entra en pantalla. */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cx(styles.sr, inView && styles.in, className)}
      style={{ "--d": delay } as CSSProperties}
    >
      {children}
    </div>
  );
}
