import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import frankieUrl from "@/modules/landing/assets/frankie.webp";
import { LANDING_NAV_LINKS } from "@/modules/landing/constants/landing.constants";
import hero from "@/modules/landing/styles/hero.module.css";
import { cx } from "@/modules/landing/utils/cx";
import { authPaths } from "@/routes/paths";

interface LandingNavProps {
  /** El hero ya terminó su coreografía de entrada. */
  revealed: boolean;
}

export default function LandingNav({ revealed }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cx(hero.nav, hero.rv, revealed && hero.revealed, scrolled && hero.navScrolled)}
      aria-label="Principal"
    >
      <a className={hero.brand} href="#inicio" aria-label="KnowLink, inicio">
        <img src={frankieUrl} alt="" width={34} />
        KNOWLINK
      </a>
      <div className={cx(hero.links, hero.mono)}>
        {LANDING_NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <div className={cx(hero.navRight, hero.mono)}>
        <Link className={hero.signin} to={authPaths.login}>
          Ingresar
        </Link>
        <Link className={hero.pillDark} to={authPaths.register}>
          Registrarme
        </Link>
      </div>
    </nav>
  );
}
