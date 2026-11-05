import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import frankieUrl from "@/modules/landing/assets/frankie.webp";
import Reveal from "@/modules/landing/components/Reveal";
import { BETA_FORM_URL } from "@/modules/landing/constants/landing.constants";
import styles from "@/modules/landing/styles/sections.module.css";
import { authPaths } from "@/routes/paths";

export default function FinalCta() {
  return (
    <>
      <section className={styles.ctaSection} aria-labelledby="landing-cta-title">
        <div className={styles.ctaGhost} aria-hidden>
          KnowLink
        </div>
        <Reveal>
          <img className={styles.ctaFrank} src={frankieUrl} alt="" width={190} />
          <h2 id="landing-cta-title">
            Sumate a la <i>corriente</i>
          </h2>
          <p>
            Creá tu cuenta y empezá como alumno, como tutor o como las dos cosas. Frankie te guía el
            resto del camino.
          </p>
          <div className={styles.ctaRow}>
            <Link className={styles.btnO} to={authPaths.register}>
              Crear mi cuenta
              <span className={styles.ar}>
                <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
            <Link className={styles.btnGhost} to={authPaths.login}>
              Ya tengo cuenta
            </Link>
          </div>
        </Reveal>
      </section>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} KnowLink · TetraCodeTeam · UTN Facultad Regional Villa María
        </span>
        <span>
          <a href={BETA_FORM_URL} target="_blank" rel="noopener noreferrer">
            Sumate como beta tester
          </a>
        </span>
      </footer>
    </>
  );
}
