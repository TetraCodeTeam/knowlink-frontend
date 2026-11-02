import { useState } from "react";
import { Check } from "lucide-react";
import Reveal from "@/modules/landing/components/Reveal";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";

interface Step {
  name: string;
  hint: string;
  title: string;
  points: string[];
  tag: string;
}

/** Cada dato se verificó contra el comportamiento real de la plataforma. */
const STEPS: Step[] = [
  {
    name: "Buscá",
    hint: "Por materia, con filtros",
    title: "Encontrá al tutor de tu materia",
    points: [
      "Buscás por materia y filtrás por modalidad, calificación, si la clase es gratuita o con arancel, y por día y franja horaria.",
      "Cada resultado muestra al tutor, su promedio de calificaciones y su perfil completo.",
      "Los tutores verificados se distinguen a simple vista.",
    ],
    tag: "Compará antes de elegir",
  },
  {
    name: "Reservá",
    hint: "Turnos de 1 a 3 horas",
    title: "Elegí un horario y reservalo",
    points: [
      "Elegís un horario libre del tutor: las clases duran entre 1 y 3 horas.",
      "Tu turno queda retenido durante 15 minutos para que completes el pago; si no lo hacés, se libera solo.",
      "Con tutores que dan clases gratuitas, reservás sin pagar.",
    ],
    tag: "Turno retenido 15 min",
  },
  {
    name: "Estudiá",
    hint: "Virtual o presencial",
    title: "Tené tu clase y llevate el material",
    points: [
      "La clase puede ser virtual o presencial, según lo que ofrezca el tutor.",
      "La sesión se confirma con un código de 4 dígitos, y los fondos quedan retenidos hasta entonces.",
      "Al completarse la sesión se desbloquea el material de estudio de ese tutor, de forma permanente.",
    ],
    tag: "Fondos en custodia",
  },
  {
    name: "Calificá",
    hint: "A ciegas, en 24 horas",
    title: "Contá cómo te fue",
    points: [
      "Alumno y tutor se califican dentro de las 24 horas posteriores a la sesión.",
      "La calificación es a ciegas: se revela cuando ambos calificaron o cuando vence el plazo.",
      "Si algo salió mal, podés iniciar un reclamo dentro de las 24 horas de finalizada la sesión.",
    ],
    tag: "Reputación justa",
  },
];

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section id="como-funciona" className={cx(styles.section, styles.alt)}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <Reveal>
              <div className={cx(styles.kicker, styles.mono)}>
                <b>02</b> Cómo funciona — de la duda a la clase
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className={styles.h2}>
                Cuatro pasos, <i>sin sorpresas</i>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <p className={styles.lead}>
              Tocá cada paso para ver qué pasa en la plataforma. Las reglas que ves acá son las
              reales: nada de letra chica escondida.
            </p>
          </Reveal>
        </div>

        <Reveal className={styles.stepsGrid}>
          <div className={styles.stepList} role="tablist" aria-label="Pasos">
            {STEPS.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={active === index}
                className={cx(styles.stepBtn, active === index && styles.stepBtnActive)}
                onClick={() => setActive(index)}
              >
                <span className={styles.stepNum}>0{index + 1}</span>
                <span>
                  <span className={styles.stepName}>{item.name}</span>
                  <span className={styles.stepHint}>{item.hint}</span>
                </span>
              </button>
            ))}
          </div>

          <article
            key={active}
            className={cx(styles.note, styles.dark, styles.stepPanel)}
            role="tabpanel"
          >
            <div className={styles.stepPanelTop}>
              <span className={cx(styles.idx, styles.mono)}>Paso {active + 1} de 4</span>
              <span className={styles.stepBig} aria-hidden>
                0{active + 1}
              </span>
            </div>
            <h3>{step.title}</h3>
            <ul className={styles.points}>
              {step.points.map((point) => (
                <li key={point}>
                  <Check size={18} aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <span className={styles.tag}>{step.tag}</span>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
