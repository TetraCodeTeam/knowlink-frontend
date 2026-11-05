import frankieUrl from "@/modules/landing/assets/frankie.webp";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";

interface FrankieFaceProps {
  className?: string;
}

/**
 * La cara de Frankie, recortada de la misma ilustración. Se recorta con CSS (sin canvas) mostrando el 53 %
 * derecho de la imagen: de ahí salen el tamaño y la posición del fondo.
 */
export default function FrankieFace({ className }: FrankieFaceProps) {
  return (
    <span
      className={cx(styles.frank, className)}
      role="img"
      aria-label="Frankie, la ballena de KnowLink"
      style={{
        backgroundImage: `url(${frankieUrl})`,
        backgroundSize: "188.7% auto",
        backgroundPosition: "100% 28%",
      }}
    />
  );
}
