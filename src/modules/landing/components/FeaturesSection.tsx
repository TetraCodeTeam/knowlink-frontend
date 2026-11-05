import {
  Bell,
  CalendarRange,
  LibraryBig,
  MessagesSquare,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/modules/landing/components/Reveal";
import { useInView } from "@/modules/landing/hooks/useInView";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";

interface Feature {
  index: string;
  icon: LucideIcon;
  title: string;
  text: string;
  wide?: boolean;
}

const FEATURES: Feature[] = [
  {
    index: "Comunidad",
    icon: MessagesSquare,
    title: "Preguntá y respondé entre pares",
    text: "Pedí ayuda con una duda, compartí un apunte, marcá «Esto me sirvió» y mirá el podio mensual de tutores destacados.",
  },
  {
    index: "Material",
    icon: LibraryBig,
    title: "Material de estudio, en su lugar",
    text: "Los tutores suben apuntes y guías por materia. Se desbloquean al completar una sesión con ellos, y podés reportar lo que no corresponda.",
  },
  {
    index: "Agenda",
    icon: CalendarRange,
    title: "Agenda y estadísticas para tutores",
    text: "Una agenda semanal para ordenar tu disponibilidad y un panel con tus clases, calificaciones y avance.",
  },
  {
    index: "Avisos y soporte",
    icon: Bell,
    title: "Notificaciones, reclamos y soporte",
    text: "Un centro de notificaciones para tus reservas y respuestas, y reclamos o pedidos de soporte desde la plataforma si una sesión no salió como debía.",
  },
];

export default function FeaturesSection() {
  const { ref: arcRef, inView: arcInView } = useInView<HTMLDivElement>();

  return (
    <section id="funcionalidades" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <Reveal>
              <div className={cx(styles.kicker, styles.mono)}>
                <b>03</b> Funcionalidades — todo en un solo lugar
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className={styles.h2}>
                Lo que necesitás para <i>aprender y enseñar</i>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <p className={styles.lead}>
              KnowLink nació como proyecto final de Ingeniería en Sistemas en la UTN FRVM, del
              equipo TetraCodeTeam. Queremos achicar la distancia entre quien necesita ayuda con una
              materia y quien puede dársela.
            </p>
          </Reveal>
        </div>

        <div className={styles.bento}>
          <div ref={arcRef} className={cx(styles.sr, arcInView && styles.in, styles.noteWide)}>
            <article className={cx(styles.note, styles.dark)} style={{ height: "100%" }}>
              <div className={styles.split}>
                <div>
                  <span className={cx(styles.idx, styles.mono)}>Nota 01 · Pagos protegidos</span>
                  <span className={styles.noteIcon} aria-hidden style={{ marginTop: 14 }}>
                    <ShieldCheck size={22} />
                  </span>
                  <h3>Tu plata, a salvo hasta la clase</h3>
                  <p>
                    Los fondos de cada reserva quedan retenidos y solo se liberan cuando la sesión
                    se confirma. Si algo falla, existe el reclamo: el dinero no se va a ningún lado
                    hasta que se resuelve.
                  </p>
                </div>
                <svg
                  className={styles.arc}
                  viewBox="0 0 360 200"
                  role="img"
                  aria-label="Del pago a la clase confirmada"
                >
                  <line className={styles.arcWater} x1="10" y1="44" x2="350" y2="44" />
                  <path
                    className={styles.arcBase}
                    d="M28 44C120 36 168 80 196 128C220 168 290 176 332 150"
                  />
                  <path
                    className={styles.arcDraw}
                    pathLength={1}
                    d="M28 44C120 36 168 80 196 128C220 168 290 176 332 150"
                  />
                  <circle cx="28" cy="44" r="5" fill="#F3A15E" />
                  <circle cx="332" cy="150" r="5" fill="#F3A15E" />
                  <text className={styles.arcLbl} x="28" y="28">
                    RESERVA
                  </text>
                  <text className={styles.arcLbl} x="350" y="190" textAnchor="end">
                    SESIÓN CONFIRMADA
                  </text>
                </svg>
              </div>
            </article>
          </div>

          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index % 3}>
              <article className={styles.note} style={{ height: "100%" }}>
                <span className={styles.noteIcon} aria-hidden>
                  <feature.icon size={22} />
                </span>
                <span className={cx(styles.idx, styles.mono)} style={{ marginTop: 16 }}>
                  {feature.index}
                </span>
                <h3 style={{ marginTop: 8 }}>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.band}>
          <div className={styles.cell}>
            <span className={styles.mono}>Turno retenido</span>
            <div className={styles.val}>15 min</div>
            <p className={styles.sub}>para completar el pago antes de que el horario se libere.</p>
            <div className={styles.vis}>
              <div className={styles.ruler}>
                <div className={styles.fill} />
              </div>
              <div className={styles.ticks} />
            </div>
          </div>
          <div className={styles.cell}>
            <span className={styles.mono}>Duración</span>
            <div className={styles.val}>1–3 h</div>
            <p className={styles.sub}>por clase, con un tope diario por materia.</p>
            <div className={cx(styles.vis, styles.circles)}>
              <i />
              <i />
            </div>
          </div>
          <div className={styles.cell}>
            <span className={styles.mono}>Calificar y reclamar</span>
            <div className={styles.val}>24 h</div>
            <p className={styles.sub}>después de la sesión para calificar o iniciar un reclamo.</p>
            <div className={styles.vis}>
              <div className={styles.shimmer} />
            </div>
          </div>
          <div className={styles.cell}>
            <span className={styles.mono}>Pagos</span>
            <div className={cx(styles.val, styles.valIt)}>En custodia</div>
            <p className={styles.sub}>los fondos quedan retenidos hasta confirmar la sesión.</p>
            <div className={styles.vis}>
              <svg className={styles.curve} viewBox="0 0 120 40" aria-hidden>
                <path pathLength={1} d="M4 34C30 6 62 2 84 16C100 26 108 34 116 20" />
              </svg>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
