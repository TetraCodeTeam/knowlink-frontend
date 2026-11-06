import type { ReactElement } from "react";
import styles from "@/shared/frankie/frankie.module.css";
import type { FrankieAccessory } from "@/shared/frankie/frankie.types";

/**
 * Detalles que acompañan a Frankie. Mismo espacio de coordenadas que la ilustración (1000 × 783);
 * viven arriba y a la derecha, donde la imagen tiene aire, para no tapar la cara.
 */

const NAVY = "#141b66";
const PERI = "#8c97f0";
const LAV = "#c7ccff";
const ORANGE = "#ff9a5c";
const YELLOW = "#ffd166";
const MINT = "#6fe0b0";
const CORAL = "#ff6f8e";

function Star({
  x,
  y,
  r,
  color,
  delay = 0,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  delay?: number;
}) {
  const d = `M${x} ${y - r} Q${x + r * 0.16} ${y - r * 0.16} ${x + r} ${y} Q${x + r * 0.16} ${y + r * 0.16} ${x} ${y + r} Q${x - r * 0.16} ${y + r * 0.16} ${x - r} ${y} Q${x - r * 0.16} ${y - r * 0.16} ${x} ${y - r} Z`;
  return (
    <path
      d={d}
      fill={color}
      className={`${styles.acc} ${styles.twinkle}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

const CONFETTI: Array<{
  x: number;
  y: number;
  color: string;
  shape: "r" | "c" | "t";
  delay: number;
}> = [
  { x: 430, y: 40, color: ORANGE, shape: "r", delay: 0 },
  { x: 540, y: -60, color: YELLOW, shape: "c", delay: 0.4 },
  { x: 640, y: 20, color: MINT, shape: "t", delay: 0.9 },
  { x: 720, y: -110, color: PERI, shape: "r", delay: 0.2 },
  { x: 810, y: -20, color: CORAL, shape: "c", delay: 1.1 },
  { x: 900, y: -100, color: YELLOW, shape: "t", delay: 0.6 },
  { x: 975, y: 20, color: ORANGE, shape: "r", delay: 1.4 },
  { x: 940, y: 150, color: MINT, shape: "c", delay: 0.3 },
  { x: 350, y: -40, color: CORAL, shape: "t", delay: 1.7 },
  { x: 590, y: 110, color: PERI, shape: "r", delay: 1.9 },
  { x: 770, y: 90, color: YELLOW, shape: "c", delay: 2.1 },
];

const ACCESSORIES: Record<FrankieAccessory, () => ReactElement> = {
  confetti: () => (
    <g>
      {CONFETTI.map((c, i) => (
        <g
          key={i}
          className={`${styles.acc} ${styles.confetti}`}
          style={{ animationDelay: `${c.delay}s` }}
        >
          {c.shape === "r" ? (
            <rect x={c.x - 15} y={c.y - 8} width={30} height={16} rx={4} fill={c.color} />
          ) : c.shape === "c" ? (
            <circle cx={c.x} cy={c.y} r={12} fill={c.color} />
          ) : (
            <path
              d={`M${c.x} ${c.y - 16} L${c.x + 16} ${c.y + 13} L${c.x - 16} ${c.y + 13} Z`}
              fill={c.color}
            />
          )}
        </g>
      ))}
    </g>
  ),

  sparkles: () => (
    <g>
      <Star x={880} y={-30} r={64} color={YELLOW} />
      <Star x={975} y={100} r={34} color={LAV} delay={0.7} />
      <Star x={700} y={-95} r={28} color={LAV} delay={1.2} />
      <Star x={470} y={70} r={26} color={YELLOW} delay={1.7} />
    </g>
  ),

  hearts: () => (
    <g>
      {[
        { x: 800, y: 70, s: 1.5, d: 0 },
        { x: 910, y: -20, s: 1, d: 1 },
        { x: 720, y: -60, s: 0.8, d: 1.9 },
      ].map((h, i) => (
        <g
          key={i}
          className={`${styles.acc} ${styles.hearts}`}
          style={{ animationDelay: `${h.d}s` }}
        >
          <path
            transform={`translate(${h.x} ${h.y}) scale(${h.s})`}
            d="M0 26 C-46 -4 -34 -42 -10 -33 C-3 -30 0 -23 0 -20 C0 -23 3 -30 10 -33 C34 -42 46 -4 0 26 Z"
            fill={CORAL}
          />
        </g>
      ))}
    </g>
  ),

  question: () => (
    <g fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontWeight={800}>
      <text
        x={850}
        y={60}
        fontSize={240}
        fill={PERI}
        textAnchor="middle"
        className={`${styles.acc} ${styles.bobQ}`}
      >
        ?
      </text>
      <text
        x={965}
        y={170}
        fontSize={120}
        fill={LAV}
        textAnchor="middle"
        className={`${styles.acc} ${styles.bobQ}`}
        style={{ animationDelay: "0.9s" }}
      >
        ?
      </text>
    </g>
  ),

  exclamation: () => (
    <g className={`${styles.acc} ${styles.popIn}`}>
      <circle cx={880} cy={0} r={82} fill={ORANGE} />
      <rect x={863} y={-52} width={34} height={72} rx={17} fill="#fff" />
      <circle cx={880} cy={42} r={17} fill="#fff" />
    </g>
  ),

  sweat: () => (
    <g className={`${styles.acc} ${styles.drip}`}>
      <g transform="translate(706 262) scale(1.7) translate(-706 -262)">
        <path
          d="M706 262 C 726 292, 730 306, 706 318 C 682 306, 686 292, 706 262 Z"
          fill="#cfe0ff"
          stroke="#9db4f5"
          strokeWidth={2}
        />
        <ellipse
          cx={699}
          cy={299}
          rx={4}
          ry={7}
          fill="#fff"
          opacity={0.85}
          transform="rotate(14 699 299)"
        />
      </g>
    </g>
  ),

  tear: () => (
    <g className={`${styles.acc} ${styles.drip}`}>
      <g transform="translate(648 398) scale(1.5) translate(-648 -398)">
        <path
          d="M648 398 C 664 420, 668 432, 648 442 C 628 432, 632 420, 648 398 Z"
          fill="#cfe0ff"
          stroke="#9db4f5"
          strokeWidth={2}
        />
        <ellipse
          cx={642}
          cy={428}
          rx={3.5}
          ry={6}
          fill="#fff"
          opacity={0.85}
          transform="rotate(14 642 428)"
        />
      </g>
    </g>
  ),

  zzz: () => (
    <g fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontWeight={800} fill={PERI}>
      <text x={760} y={80} fontSize={120} className={`${styles.acc} ${styles.zzz}`}>
        Z
      </text>
      <text
        x={865}
        y={-20}
        fontSize={88}
        className={`${styles.acc} ${styles.zzz}`}
        style={{ animationDelay: "1.1s" }}
      >
        Z
      </text>
      <text
        x={955}
        y={-90}
        fontSize={62}
        className={`${styles.acc} ${styles.zzz}`}
        style={{ animationDelay: "2.2s" }}
      >
        z
      </text>
    </g>
  ),

  magnifier: () => (
    <g className={`${styles.acc} ${styles.scan}`}>
      <circle
        cx={850}
        cy={40}
        r={84}
        fill="#fff"
        fillOpacity={0.4}
        stroke={PERI}
        strokeWidth={22}
      />
      <path
        d="M808 10 Q822 -20 858 -26"
        fill="none"
        stroke="#fff"
        strokeWidth={10}
        strokeLinecap="round"
        opacity={0.9}
      />
      <path d="M912 102 L990 182" stroke={NAVY} strokeWidth={26} strokeLinecap="round" />
    </g>
  ),

  hardhat: () => (
    <g className={`${styles.acc} ${styles.wobble}`}>
      <g transform="translate(776 170) rotate(-7) scale(1.3)">
        <path d="M-92 4 C-92 -58, -40 -84, 0 -84 C40 -84, 92 -58, 92 4 Z" fill={YELLOW} />
        <path d="M-12 -84 H12 V4 H-12 Z" fill="#f0b429" />
        <path
          d="M-92 4 H92 Q104 4 104 14 Q104 24 92 24 H-92 Q-104 24 -104 14 Q-104 4 -92 4 Z"
          fill="#f0b429"
        />
        <path
          d="M-68 -34 Q-54 -62 -24 -70"
          fill="none"
          stroke="#fff"
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.7}
        />
      </g>
    </g>
  ),
};

export function FrankieAccessories({ items }: { items: FrankieAccessory[] }) {
  return (
    <g>
      {items.map((name) => {
        const Accessory = ACCESSORIES[name];
        return <Accessory key={name} />;
      })}
    </g>
  );
}
