import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** Segundos que tarda Frankie en nadar hasta su lugar. */
const SWIM_SECONDS = 4.6;
/** Instante (en segundos de ese nado) en que la interfaz puede aparecer. */
const REVEAL_AT_SECONDS = 3.9;
/** Si algo falla, la interfaz aparece igual a los 9 s: el hero nunca queda en blanco. */
const HARD_REVEAL_MS = 9000;

const KEYFRAMES = [
  { transform: "translate(38vw,-4vh) rotate(-7deg) scale(.5)", opacity: 0, offset: 0 },
  { opacity: 1, offset: 0.18 },
  { transform: "translate(14vw,3vh) rotate(-3deg) scale(.82)", opacity: 1, offset: 0.55 },
  { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1, offset: 1 },
];

export interface HeroReveal {
  whaleRef: RefObject<HTMLDivElement | null>;
  /** true cuando Frankie ya se acomodó y el resto del hero puede aparecer. */
  revealed: boolean;
  replay: () => void;
}

/** Coreografía de entrada del hero: Frankie nada hacia su lugar y recién después aparece la interfaz. */
export function useHeroReveal(): HeroReveal {
  const whaleRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const frameRef = useRef(0);
  const timerRef = useRef(0);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const stopTimers = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    window.clearTimeout(timerRef.current);
  }, []);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    stopTimers();
    setRevealed(true);
  }, [stopTimers]);

  const play = useCallback(() => {
    const whale = whaleRef.current;
    if (!whale) return;
    stopTimers();
    revealedRef.current = false;
    setRevealed(false);
    animationRef.current?.cancel();

    if (!whale.animate) {
      whale.style.opacity = "1";
      reveal();
      return;
    }

    const animation = whale.animate(KEYFRAMES, {
      duration: SWIM_SECONDS * 1000,
      easing: "cubic-bezier(.3,.6,.15,1)",
      fill: "forwards",
    });
    animationRef.current = animation;
    animation.onfinish = reveal;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.finish();
      reveal();
      return;
    }

    const tick = () => {
      if (revealedRef.current) return;
      const elapsed = Number(animation.currentTime ?? 0) / 1000;
      if (elapsed >= REVEAL_AT_SECONDS) {
        reveal();
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    timerRef.current = window.setTimeout(reveal, HARD_REVEAL_MS);
  }, [reveal, stopTimers]);

  useEffect(() => {
    play();
    return () => {
      stopTimers();
      animationRef.current?.cancel();
    };
  }, [play, stopTimers]);

  return { whaleRef, revealed, replay: play };
}
