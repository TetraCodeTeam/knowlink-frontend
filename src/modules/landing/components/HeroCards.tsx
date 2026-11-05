import type { CSSProperties, ReactNode } from "react";
import hero from "@/modules/landing/styles/hero.module.css";
import { cx } from "@/modules/landing/utils/cx";

/** Símbolo de estrella compartido por las ilustraciones (se referencia con <use href="#kl-star">). */
export function StarSymbol() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <symbol id="kl-star" viewBox="0 0 24 24">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
        </symbol>
      </defs>
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg
      className={hero.ill}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Lupa sobre perfiles de tutores, uno elegido"
    >
      <circle cx="100" cy="74" r="70" fill="rgba(89,201,214,.12)" />
      <rect
        x="30"
        y="30"
        width="118"
        height="66"
        rx="13"
        fill="#B7C0F2"
        opacity=".5"
        transform="rotate(-7 89 63)"
      />
      <rect x="40" y="36" width="122" height="74" rx="13" fill="#E4E8F8" />
      <circle cx="64" cy="62" r="13" fill="#5864D6" />
      <circle cx="64" cy="58" r="4.6" fill="#E4E8F8" />
      <path d="M55 69a9 7 0 0 1 18 0z" fill="#E4E8F8" />
      <rect x="86" y="53" width="52" height="7" rx="3.5" fill="#2A3070" />
      <rect x="86" y="66" width="36" height="5" rx="2.5" fill="#4A5290" opacity=".5" />
      <g fill="#E8732A">
        <use href="#kl-star" x="52" y="82" width="13" height="13" />
        <use href="#kl-star" x="67" y="82" width="13" height="13" />
        <use href="#kl-star" x="82" y="82" width="13" height="13" />
        <use href="#kl-star" x="97" y="82" width="13" height="13" />
        <use href="#kl-star" x="112" y="82" width="13" height="13" opacity=".35" />
      </g>
      <circle cx="158" cy="42" r="11" fill="#E8732A" />
      <path
        d="M152.5 42.5l3.8 3.8 7-8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="128"
        cy="92"
        r="27"
        fill="rgba(89,201,214,.22)"
        stroke="#F3A15E"
        strokeWidth="7"
      />
      <path
        d="M115 82a16 16 0 0 1 12-9"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".7"
      />
      <path d="M148 113l24 25" stroke="#F3A15E" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIllustration() {
  return (
    <svg
      className={hero.ill}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Calendario con un horario elegido y un reloj"
    >
      <circle cx="100" cy="76" r="70" fill="rgba(232,115,42,.10)" />
      <rect x="36" y="30" width="128" height="104" rx="14" fill="#E4E8F8" />
      <path d="M36 44a14 14 0 0 1 14-14h100a14 14 0 0 1 14 14v13H36z" fill="#5864D6" />
      <rect x="68" y="21" width="7" height="17" rx="3.5" fill="#0F1340" />
      <rect x="125" y="21" width="7" height="17" rx="3.5" fill="#0F1340" />
      <g fill="#B7C0F2">
        <rect x="48" y="66" width="20" height="14" rx="4" />
        <rect x="76" y="66" width="20" height="14" rx="4" />
        <rect x="104" y="66" width="20" height="14" rx="4" opacity=".45" />
        <rect x="132" y="66" width="20" height="14" rx="4" />
        <rect x="48" y="88" width="20" height="14" rx="4" opacity=".45" />
        <rect x="76" y="88" width="20" height="14" rx="4" />
        <rect x="132" y="88" width="20" height="14" rx="4" />
        <rect x="48" y="110" width="20" height="14" rx="4" />
        <rect x="76" y="110" width="20" height="14" rx="4" opacity=".45" />
        <rect x="104" y="110" width="20" height="14" rx="4" />
      </g>
      <rect x="102" y="86" width="24" height="18" rx="5" fill="#E8732A" />
      <path
        d="M108 95.5l4 4 7-8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="150" cy="118" r="21" fill="#0F1340" stroke="#F3A15E" strokeWidth="4" />
      <path
        d="M150 106v12l8 5"
        fill="none"
        stroke="#E4E8F8"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface HeroCardProps {
  index: string;
  label: string;
  caption: string;
  stat: string;
  drop?: boolean;
  delay: number;
  children: ReactNode;
}

function HeroCard({ index, label, caption, stat, drop, delay, children }: HeroCardProps) {
  return (
    <article
      className={cx(hero.card, hero.rv, drop && hero.drop)}
      style={{ "--d": delay } as CSSProperties}
    >
      <div className={cx(hero.cardHd, hero.mono)}>
        <span>{label}</span>
        <span>/ {index}</span>
      </div>
      <div className={hero.thumb}>
        {children}
        <span className={cx(hero.cap, hero.mono)}>{caption}</span>
      </div>
      <div className={hero.cardFt}>
        <span className={hero.stat}>{stat}</span>
        <span className={hero.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </div>
    </article>
  );
}

export default function HeroCards() {
  return (
    <div className={hero.cards}>
      <HeroCard
        index="01"
        label="Búsqueda"
        caption="Perfiles por materia"
        stat="Buscá · Elegí"
        delay={6}
      >
        <SearchIllustration />
      </HeroCard>
      <HeroCard index="02" label="Turnos" caption="Elegí tu horario" stat="Reservá" drop delay={7}>
        <CalendarIllustration />
      </HeroCard>
    </div>
  );
}
