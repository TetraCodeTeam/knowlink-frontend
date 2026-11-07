import type { ReactElement } from "react";
import styles from "@/shared/frankie/frankie.module.css";
import type { FrankieMood } from "@/shared/frankie/frankie.types";

/**
 * Cara de Frankie dibujada sobre la ilustración limpia (sin ojo, ceja ni comisura de la boca).
 * Todas las coordenadas están en el espacio de la imagen original: 1000 × 783.
 *
 *  - ojo: centro (632, 361), esclerótica 42 × 44
 *  - la línea larga de la boca nace en (666, 418); cada expresión dibuja la comisura desde ahí
 */

const NAVY = "#141b66";
const BODY = "#4c54cb";
const SCLERA = "#ffffff";

interface FaceProps {
  /** Prefijo único para los `id` de SVG (clipPath), así varias Frankies en pantalla no chocan. */
  uid: string;
}

/* ───────────────────────── Piezas ───────────────────────── */

function Brow({ d, width = 9 }: { d: string; width?: number }) {
  return <path d={d} fill="none" stroke={NAVY} strokeWidth={width} strokeLinecap="round" />;
}

/** Rubor de la mejilla, en el mismo azul de la paleta para que no desentone. */
function Blush({ color = "#9aa6ff", opacity = 0.5 }: { color?: string; opacity?: number }) {
  return <ellipse cx={709} cy={392} rx={22} ry={12} fill={color} opacity={opacity * 0.75} />;
}

interface OpenEyeProps {
  uid: string;
  /** Desplazamiento de la mirada (px de la imagen). */
  look?: [number, number];
  /** Radio de la pupila (por defecto 29). */
  pupil?: number;
  /** Agranda el ojo entero (sorpresa). */
  scale?: number;
  /** Doble brillo: ojos "vidriosos" de tristeza. */
  glossy?: boolean;
  /** Párpado superior caído: 0 = sin párpado, 1 = cubre casi la mitad. */
  lid?: number;
  /** Inclinación del párpado (positivo = el lado de afuera más bajo). */
  lidTilt?: number;
  blink?: boolean;
}

function OpenEye({
  uid,
  look = [0, 0],
  pupil = 29,
  scale = 1,
  glossy = false,
  lid = 0,
  lidTilt = 0,
  blink = true,
}: OpenEyeProps) {
  const [lx, ly] = look;
  const clipId = `${uid}-eye`;
  const lidY = 317 + lid * 44;
  return (
    <g className={blink ? styles.blink : undefined}>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx={632} cy={361} rx={42} ry={44} />
        </clipPath>
      </defs>
      <g transform={`translate(632 361) scale(${scale}) translate(-632 -361)`}>
        <ellipse cx={632} cy={361} rx={42} ry={44} fill={SCLERA} />
        <g clipPath={`url(#${clipId})`}>
          <circle cx={644 + lx} cy={364 + ly} r={pupil} fill={NAVY} />
          <circle cx={629 + lx * 0.7} cy={349 + ly * 0.7} r={12.5} fill={SCLERA} />
          {glossy ? (
            <>
              <circle
                cx={656 + lx * 0.5}
                cy={382 + ly * 0.5}
                r={6.5}
                fill={SCLERA}
                opacity={0.85}
              />
              <circle cx={640 + lx} cy={388 + ly} r={3.2} fill={SCLERA} opacity={0.6} />
            </>
          ) : (
            <circle cx={657 + lx * 0.6} cy={381 + ly * 0.6} r={4.5} fill={SCLERA} opacity={0.75} />
          )}
          {lid > 0 ? (
            <>
              <path
                d={`M560 280 L700 280 L700 ${lidY - lidTilt} L560 ${lidY + lidTilt} Z`}
                fill={BODY}
              />
              <path
                d={`M560 ${lidY + lidTilt} L700 ${lidY - lidTilt}`}
                stroke={NAVY}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </>
          ) : null}
        </g>
      </g>
    </g>
  );
}

/** Ojo cerrado: arco hacia arriba (alegría) o hacia abajo (sueño). */
function ClosedEye({ happy }: { happy: boolean }) {
  return (
    <path
      d={happy ? "M595 376 Q632 322 671 374" : "M595 356 Q633 390 671 357"}
      fill="none"
      stroke={NAVY}
      strokeWidth={10}
      strokeLinecap="round"
    />
  );
}

/** Comisura de la sonrisa, igual que la ilustración original. */
function SmileCorner() {
  return (
    <path
      d="M677 409 Q662 413 654 431"
      fill="none"
      stroke={NAVY}
      strokeWidth={9}
      strokeLinecap="round"
    />
  );
}

function FrownCorner() {
  return (
    <path
      d="M668 419 Q657 424 653 440"
      fill="none"
      stroke={NAVY}
      strokeWidth={9}
      strokeLinecap="round"
    />
  );
}

/** Boca abierta de alegría, colgando de la línea de la boca sobre el vientre blanco. */
function OpenGrin() {
  return (
    <g>
      <path d="M672 421 C 678 472, 748 476, 764 442 Q 720 452 672 421 Z" fill={NAVY} />
      <path d="M696 462 C 708 452, 734 452, 748 458 C 738 472, 710 474, 696 462 Z" fill="#7d8af2" />
      <path
        d="M668 419 Q 650 414 644 400"
        fill="none"
        stroke={NAVY}
        strokeWidth={9}
        strokeLinecap="round"
      />
    </g>
  );
}

/* ───────────────────────── Expresiones ───────────────────────── */

const FACES: Record<FrankieMood, (props: FaceProps) => ReactElement> = {
  happy: ({ uid }) => (
    <g>
      <Blush opacity={0.4} />
      <OpenEye uid={uid} />
      <Brow d="M586 318 Q603 296 637 287" />
      <SmileCorner />
    </g>
  ),

  celebrate: () => (
    <g>
      <Blush opacity={0.65} />
      <ClosedEye happy />
      <Brow d="M588 308 Q606 286 638 280" width={8} />
      <OpenGrin />
    </g>
  ),

  sad: ({ uid }) => (
    <g>
      <OpenEye uid={uid} look={[-3, 9]} pupil={30} glossy lid={0.32} lidTilt={9} />
      <Brow d="M580 330 Q604 314 640 282" />
      <FrownCorner />
    </g>
  ),

  worried: ({ uid }) => (
    <g>
      <OpenEye uid={uid} look={[-13, 3]} pupil={24} />
      <Brow d="M578 332 Q603 318 638 288" />
      <path
        d="M646 427 q6 -9 12 0 t12 0 t12 0"
        fill="none"
        stroke={NAVY}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </g>
  ),

  surprised: ({ uid }) => (
    <g>
      <OpenEye uid={uid} look={[-11, -2]} pupil={17} scale={1.14} />
      <Brow d="M582 290 Q606 262 642 266" />
      <ellipse cx={659} cy={433} rx={11} ry={14} fill={NAVY} />
      <ellipse cx={659} cy={438} rx={6} ry={6.5} fill="#7d8af2" />
    </g>
  ),

  thinking: ({ uid }) => (
    <g>
      <OpenEye uid={uid} look={[-12, -16]} />
      <Brow d="M590 304 Q612 280 644 284" />
      <path
        d="M650 430 Q660 424 668 419"
        fill="none"
        stroke={NAVY}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </g>
  ),

  sleepy: () => (
    <g>
      <Blush opacity={0.5} />
      <ClosedEye happy={false} />
      <path
        d="M676 412 Q664 416 657 428"
        fill="none"
        stroke={NAVY}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </g>
  ),

  love: ({ uid }) => {
    const clipId = `${uid}-heart-eye`;
    return (
      <g>
        <Blush color="#ff9bb3" opacity={0.7} />
        <g className={styles.blink}>
          <defs>
            <clipPath id={clipId}>
              <ellipse cx={632} cy={361} rx={42} ry={44} />
            </clipPath>
          </defs>
          <ellipse cx={632} cy={361} rx={42} ry={44} fill={SCLERA} />
          <g clipPath={`url(#${clipId})`}>
            <g transform="translate(636 366) scale(1.05)">
              <path
                d="M0 24 C-42 -4 -32 -38 -9 -30 C-3 -27 0 -21 0 -18 C0 -21 3 -27 9 -30 C32 -38 42 -4 0 24 Z"
                fill="#ff5d85"
              />
              <ellipse
                cx={-14}
                cy={-12}
                rx={7}
                ry={5}
                fill="#fff"
                opacity={0.85}
                transform="rotate(-30 -14 -12)"
              />
            </g>
          </g>
        </g>
        <Brow d="M586 316 Q604 292 638 286" />
        <SmileCorner />
      </g>
    );
  },
};

export function FrankieFeatures({ mood, uid }: { mood: FrankieMood; uid: string }) {
  const Face = FACES[mood];
  return <Face uid={uid} />;
}
