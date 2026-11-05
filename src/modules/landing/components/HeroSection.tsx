import { useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import betaQrUrl from "@/modules/landing/assets/beta-qr.svg";
import frankieUrl from "@/modules/landing/assets/frankie.webp";
import HeroCards, { StarSymbol } from "@/modules/landing/components/HeroCards";
import { BETA_FORM_URL } from "@/modules/landing/constants/landing.constants";
import { useLivingWhale } from "@/modules/landing/hooks/useLivingWhale";
import type { HeroReveal } from "@/modules/landing/hooks/useHeroReveal";
import hero from "@/modules/landing/styles/hero.module.css";
import { cx } from "@/modules/landing/utils/cx";
import { authPaths } from "@/routes/paths";

interface HeroSectionProps {
  reveal: HeroReveal;
  onOpenAbout: () => void;
}

const delay = (steps: number) => ({ "--d": steps }) as CSSProperties;

export default function HeroSection({ reveal, onOpenAbout }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const alive = useLivingWhale(imageRef, canvasRef, heroRef);

  return (
    <header id="inicio" ref={heroRef} className={cx(hero.hero, reveal.revealed && hero.revealed)}>
      <StarSymbol />

      {/* Frankie: la ilustración oficial, que nada hasta su lugar y después "cobra vida" en el canvas. */}
      <div ref={reveal.whaleRef} className={cx(hero.whale, alive && hero.alive)} aria-hidden>
        <div className={hero.whaleBob}>
          <img ref={imageRef} src={frankieUrl} alt="" width={1000} height={783} />
          <canvas ref={canvasRef} aria-hidden />
        </div>
      </div>

      <div className={hero.ghost} aria-hidden>
        Know<i>Link</i>
      </div>
      <div className={hero.shade} />

      <div className={hero.copy}>
        <p className={hero.tagline}>
          Frankie te acompaña: <i>conectá, aprendé y avanzá.</i>
        </p>
        <h1 className={cx(hero.h1, hero.rv)} style={delay(2)}>
          Aprendé con el tutor <i>indicado</i>
        </h1>
        <p className={cx(hero.lede, hero.rv)} style={delay(3)}>
          KnowLink conecta a estudiantes con tutores por materia: buscás, mirás el perfil y las
          calificaciones, reservás tu turno y accedés al material de estudio. Y con una sola cuenta
          podés ser alumno y tutor.
        </p>
        <div className={cx(hero.cta, hero.rv)} style={delay(4)}>
          <Link className={hero.btnO} to={authPaths.register}>
            Crear mi cuenta
            <span className={hero.ar} aria-hidden>
              <ArrowRight size={14} />
            </span>
          </Link>
          <button type="button" className={hero.btnLink} onClick={onOpenAbout}>
            Conocé a Frankie
          </button>
        </div>
      </div>

      <aside className={hero.side}>
        <div className={cx(hero.trust, hero.rv)} style={delay(5)}>
          <div className={hero.stars} role="img" aria-label="5 de 5 estrellas">
            {[0, 1, 2, 3, 4].map((star) => (
              <svg key={star} viewBox="0 0 24 24" aria-hidden>
                <use href="#kl-star" />
              </svg>
            ))}
          </div>
          <p>
            <b>Perfiles y calificaciones</b>
            <br />
            para elegir con confianza
          </p>
        </div>
        <HeroCards />
      </aside>

      <a
        className={cx(hero.qr, hero.rv)}
        style={delay(7)}
        href={BETA_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Escaneá o tocá para sumarte como beta tester de KnowLink (abre un formulario)"
        aria-label="Sumate como beta tester de KnowLink: abre un formulario"
      >
        <span className={hero.qrTile}>
          <img src={betaQrUrl} alt="Código QR del formulario de beta testers de KnowLink" />
        </span>
        <span className={hero.mono}>Sé beta tester</span>
      </a>

      <div className={cx(hero.strip, hero.rv)} style={delay(8)}>
        <div className={hero.sp}>
          <span className={hero.mono}>Mascota 01 · Frankie</span>
          <em>Eubalaena australis</em>
        </div>
        <div className={cx(hero.coord, hero.mono)}>Península Valdés · 42.5° S</div>
        <button type="button" className={cx(hero.replay, hero.mono)} onClick={reveal.replay}>
          <RotateCcw size={12} aria-hidden />
          Repetir
        </button>
      </div>
    </header>
  );
}
