import { useId, type CSSProperties } from "react";
import baseUrl from "@/shared/frankie/assets/frankie-base.webp";
import { FrankieAccessories } from "@/shared/frankie/frankie.accessories";
import { FrankieFeatures } from "@/shared/frankie/frankie.moods";
import styles from "@/shared/frankie/frankie.module.css";
import {
  DEFAULT_ACCESSORIES,
  type FrankieAccessory,
  type FrankieMood,
} from "@/shared/frankie/frankie.types";

/** Más alto que la ilustración (783) para dejar aire arriba a los accesorios. */
const FULL_VIEWBOX = "0 -170 1040 953";
/** Recorte cuadrado alrededor del ojo y la boca: sirve para avatares pequeños. */
const FACE_VIEWBOX = "520 250 262 262";

export interface FrankieProps {
  /** Expresión de Frankie. Por defecto, feliz. */
  mood?: FrankieMood;
  /**
   * Detalles que lo acompañan (confeti, lágrima, "?"…). Si no se indica, usa los del ánimo;
   * pasá `[]` para mostrarlo solo. Se ignoran en el recorte de cara.
   */
  accessories?: FrankieAccessory[];
  /** Ancho en px (o cualquier medida CSS). El alto se ajusta solo. */
  size?: number | string;
  /** `full` = cuerpo completo; `face` = avatar circular de la cara. */
  crop?: "full" | "face";
  /** Movimiento sutil del cuerpo y parpadeo. Por defecto sí en `full`, no en `face`. */
  animated?: boolean;
  /** Anima la entrada (aparece con un pequeño salto). */
  entrance?: boolean;
  /**
   * Texto accesible. Si se omite, Frankie se considera decorativo (el texto que lo acompaña ya
   * dice lo importante) y se oculta a los lectores de pantalla.
   */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Frankie, la ballena franca austral de KnowLink. Una única ilustración de base y un sistema de
 * expresiones dibujado encima: así cambia de ánimo sin dejar de ser reconocible.
 */
export default function Frankie({
  mood = "happy",
  accessories,
  size = 160,
  crop = "full",
  animated,
  entrance = false,
  label,
  className,
  style,
}: FrankieProps) {
  const uid = useId().replace(/:/g, "");
  const isFace = crop === "face";
  const moves = animated ?? !isFace;
  const items = accessories ?? DEFAULT_ACCESSORIES[mood];

  const classes = [
    styles.root,
    isFace ? styles.face : "",
    moves ? styles[`m_${mood}`] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const accessibility = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <span
      className={classes}
      style={{ width: typeof size === "number" ? `${size}px` : size, ...style }}
    >
      <svg
        // La entrada va en el <svg> y el movimiento en el contenedor: así no se pisan.
        className={entrance ? `${styles.svg} ${styles.enter}` : styles.svg}
        viewBox={isFace ? FACE_VIEWBOX : FULL_VIEWBOX}
        focusable="false"
        {...accessibility}
      >
        <image href={baseUrl} x={0} y={0} width={1000} height={783} />
        <FrankieFeatures mood={mood} uid={uid} />
        {isFace ? null : <FrankieAccessories items={items} />}
      </svg>
    </span>
  );
}
