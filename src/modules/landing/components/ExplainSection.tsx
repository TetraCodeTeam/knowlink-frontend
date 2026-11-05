import { useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, FileText, LockOpen } from "lucide-react";
import FrankieFace from "@/modules/landing/components/FrankieFace";
import Reveal from "@/modules/landing/components/Reveal";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";

/* ------------------------------------------------------------------ pregunta de Frankie */

interface QuizProps {
  question: string;
  options: Array<{ key: string; label: string }>;
  answer: string;
  ok: string;
  no: string;
}

function Quiz({ question, options, answer, ok, no }: QuizProps) {
  const [picked, setPicked] = useState<Record<string, "ok" | "no">>({});
  const [feedback, setFeedback] = useState<{ good: boolean; text: string } | null>(null);
  const solved = Object.values(picked).includes("ok");

  const choose = (key: string) => {
    const good = key === answer;
    setPicked((current) => ({ ...current, [key]: good ? "ok" : "no" }));
    setFeedback({ good, text: good ? ok : no });
  };

  return (
    <article className={cx(styles.note, styles.ask)}>
      <span className={cx(styles.idx, styles.mono)}>Frankie te pregunta</span>
      <h3>{question}</h3>
      <div className={styles.opts}>
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            disabled={solved || picked[option.key] !== undefined}
            className={cx(
              picked[option.key] === "ok" && styles.optOk,
              picked[option.key] === "no" && styles.optNo
            )}
            onClick={() => choose(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p
        className={cx(styles.fb, feedback && (feedback.good ? styles.fbOk : styles.fbNo))}
        aria-live="polite"
      >
        {feedback?.text}
      </p>
    </article>
  );
}

/* ------------------------------------------------------------------ globo de Frankie */

function Says({ children }: { children: ReactNode }) {
  return (
    <div className={styles.say}>
      <FrankieFace />
      <div className={styles.bubble}>
        <span className={cx(styles.mono, styles.whoLbl)}>Frankie dice</span>
        <p>{children}</p>
      </div>
    </div>
  );
}

function VizHead({ note }: { note: string }) {
  return (
    <div className={styles.vizHead}>
      <span className={cx(styles.idx, styles.mono)}>Para mirar</span>
      <span className={styles.mono}>{note}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ visuales */

function ProfileAnatomy() {
  return (
    <article className={cx(styles.note, styles.dark)}>
      <VizHead note="Ejemplo ilustrativo" />
      <h3>Anatomía de un perfil</h3>
      <div className={styles.anat}>
        <div
          className={styles.prof}
          role="img"
          aria-label="Perfil de tutor de ejemplo con cuatro partes numeradas"
        >
          <div className={styles.profTop}>
            <span className={styles.ph} />
            <span className={styles.sks}>
              <i className={styles.sk} />
              <i className={cx(styles.sk, styles.skShort)} />
            </span>
          </div>
          <div className={styles.prow}>
            <span className={styles.num}>1</span>
            <span className={styles.pchip}>Materia A</span>
            <span className={styles.pchip}>Materia B</span>
          </div>
          <div className={styles.prow}>
            <span className={styles.num}>2</span>
            <span className={styles.pstars}>
              {[0, 1, 2, 3, 4].map((star) => (
                <svg key={star} viewBox="0 0 24 24" className={star === 4 ? styles.pstarOff : ""}>
                  <use href="#kl-star" />
                </svg>
              ))}
            </span>
            <i className={styles.sk} style={{ width: 70 }} />
          </div>
          <div className={styles.prow}>
            <span className={styles.num}>3</span>
            <span className={styles.pchip}>Virtual o presencial</span>
          </div>
          <div className={styles.prow}>
            <span className={styles.num}>4</span>
            <span className={cx(styles.pchip, styles.pchipWarm)}>Gratis o con arancel</span>
          </div>
        </div>
        <ol className={styles.legend}>
          <li>
            <span className={styles.num}>1</span>Las materias que enseña
          </li>
          <li>
            <span className={styles.num}>2</span>Promedio y comentarios por materia
          </li>
          <li>
            <span className={styles.num}>3</span>Cómo da sus clases
          </li>
          <li>
            <span className={styles.num}>4</span>Si la clase es gratuita o tiene arancel
          </li>
        </ol>
      </div>
    </article>
  );
}

function CatalogTree() {
  return (
    <article className={cx(styles.note, styles.dark)}>
      <VizHead note="Ejemplo ilustrativo" />
      <h3>El catálogo, de izquierda a derecha</h3>
      <svg
        className={styles.tree}
        viewBox="0 0 480 290"
        role="img"
        aria-label="Un catálogo con dos carreras, cada una con sus materias, y un grupo de materias básicas comunes a todas"
      >
        <g>
          <path className={styles.ln} pathLength={1} d="M108 142C132 142 132 54 156 54" />
          <path className={styles.ln} pathLength={1} d="M108 142H156" />
          <path className={styles.ln} pathLength={1} d="M108 142C132 142 132 236 156 236" />
          <path className={styles.ln} pathLength={1} d="M324 54C346 54 346 28 368 28" />
          <path className={styles.ln} pathLength={1} d="M324 54C346 54 346 76 368 76" />
          <path className={styles.ln} pathLength={1} d="M324 142H368" />
          <path className={styles.ln} pathLength={1} d="M324 236C346 236 346 220 368 220" />
          <path className={styles.ln} pathLength={1} d="M324 236C346 236 346 262 368 262" />
        </g>
        <rect x="4" y="118" width="104" height="48" rx="12" fill="#5864D6" />
        <text x="56" y="142" fill="#fff">
          Catálogo
        </text>
        <g fill="rgba(228,232,248,.1)" stroke="rgba(228,232,248,.34)" strokeWidth="1.4">
          <rect x="156" y="34" width="168" height="40" rx="11" />
          <rect x="156" y="122" width="168" height="40" rx="11" />
        </g>
        <text x="240" y="54" fill="#E4E8F8">
          Carrera A
        </text>
        <text x="240" y="142" fill="#E4E8F8">
          Carrera B
        </text>
        <rect
          x="156"
          y="216"
          width="168"
          height="40"
          rx="11"
          fill="rgba(243,161,94,.15)"
          stroke="#F3A15E"
          strokeWidth="1.6"
        />
        <text x="240" y="236" fill="#F3A15E" style={{ fontSize: "13.5px" }}>
          Materias básicas
        </text>
        <g fill="#B7C0F2">
          <rect x="368" y="12" width="112" height="32" rx="10" />
          <rect x="368" y="60" width="112" height="32" rx="10" />
          <rect x="368" y="126" width="112" height="32" rx="10" />
        </g>
        <g fill="#F3A15E">
          <rect x="368" y="204" width="112" height="32" rx="10" />
          <rect x="368" y="246" width="112" height="32" rx="10" />
        </g>
        <g fill="#0E1238" style={{ fontSize: "13.5px" }}>
          <text x="424" y="28">
            Materia 1
          </text>
          <text x="424" y="76">
            Materia 2
          </text>
          <text x="424" y="142">
            Materia 3
          </text>
          <text x="424" y="220">
            Álgebra
          </text>
          <text x="424" y="262">
            Física
          </text>
        </g>
      </svg>
    </article>
  );
}

function MaterialFlow() {
  return (
    <article className={cx(styles.note, styles.dark)}>
      <VizHead note="El recorrido de un material" />
      <h3>De la mano del tutor a la tuya</h3>
      <div className={styles.flow}>
        <div className={styles.step}>
          <span className={styles.ic}>
            <FileText size={22} aria-hidden />
          </span>
          <b>1. Se sube</b>
          <p>Un tutor sube un apunte o una guía.</p>
        </div>
        <ArrowRight className={styles.arr} aria-hidden />
        <div className={styles.step}>
          <span className={styles.ic}>
            <BookOpen size={22} aria-hidden />
          </span>
          <b>2. Se ordena</b>
          <p>Queda asociado a una materia.</p>
        </div>
        <ArrowRight className={styles.arr} aria-hidden />
        <div className={styles.step}>
          <span className={styles.ic}>
            <LockOpen size={22} aria-hidden />
          </span>
          <b>3. Se desbloquea</b>
          <p>Cuando completás una sesión con ese tutor, lo abrís y lo descargás.</p>
        </div>
      </div>
      <span className={styles.tag}>Cada material = un tutor + una materia</span>
    </article>
  );
}

/* ------------------------------------------------------------------ temas */

interface Topic {
  id: string;
  label: string;
  says: string;
  viz: ReactNode;
  quiz: QuizProps;
}

const TOPICS: Topic[] = [
  {
    id: "tutores",
    label: "Tutores",
    says: "¡Hola! Soy Frankie y te acompaño por acá. Un tutor es una persona que conoce bien una materia y te ayuda a estudiarla. En KnowLink cada tutor tiene un perfil público, elige qué materias enseña, cómo da sus clases y si cobra o no. Vos elegís con quién estudiar.",
    viz: <ProfileAnatomy />,
    quiz: {
      question: "Un tutor da clases gratuitas. ¿Qué pasa cuando reservás?",
      options: [
        { key: "a", label: "Pagás igual y después te devuelven la plata" },
        { key: "b", label: "Reservás sin pagar" },
        { key: "c", label: "No se puede reservar" },
      ],
      answer: "b",
      ok: "¡Eso! Con tutores de clases gratuitas la reserva se confirma sin pago.",
      no: "Casi. Pensá qué significa que la clase sea gratuita e intentá de nuevo.",
    },
  },
  {
    id: "materias",
    label: "Materias",
    says: "Seguimos. Una materia es cada asignatura de tu carrera, y en KnowLink todo gira alrededor de ellas. Las ordenamos en un catálogo simple: carreras con sus materias. Además hay materias básicas, como Álgebra o Física, que son comunes a todas las carreras. Los tutores eligen entre las materias del catálogo.",
    viz: <CatalogTree />,
    quiz: {
      question: "¿Dónde vive Álgebra, una materia que se cursa en varias carreras?",
      options: [
        { key: "a", label: "Se copia dentro de cada carrera" },
        { key: "b", label: "La agrega cada tutor cuando la necesita" },
        { key: "c", label: "Entre las materias básicas, comunes a todas las carreras" },
      ],
      answer: "c",
      ok: "¡Exacto! Se carga una sola vez y sirve para cualquier carrera.",
      no: "No tanto. Fijate en el árbol de arriba: hay un grupo de color distinto.",
    },
  },
  {
    id: "materiales",
    label: "Materiales",
    says: "Última parada. Un material es un archivo de estudio, como apuntes o guías, que sube un tutor. Cada material pertenece a un tutor y a una materia, así lo encontrás ordenado. Y se desbloquea para vos cuando completás una sesión con ese tutor. Si algo no corresponde, podés reportarlo.",
    viz: <MaterialFlow />,
    quiz: {
      question: "¿Cuándo se desbloquea el material de un tutor para vos?",
      options: [
        { key: "a", label: "Apenas hacés la reserva" },
        { key: "b", label: "Cuando completás una sesión con ese tutor" },
        { key: "c", label: "Cuando lo calificás" },
      ],
      answer: "b",
      ok: "¡Eso! Es por sesión completada, y una vez desbloqueado queda abierto para siempre.",
      no: "Todavía no. Volvé a leer el globo de arriba y probá otra vez.",
    },
  },
];

export default function ExplainSection() {
  const [active, setActive] = useState(0);
  const topic = TOPICS[active];

  return (
    <section id="frankie" className={cx(styles.section, styles.alt)}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <Reveal>
              <div className={cx(styles.kicker, styles.mono)}>
                <b>05</b> Frankie explica — aprendé jugando
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className={styles.h2}>
                Tres conceptos, <i>una ballena</i> que te los cuenta
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <p className={styles.lead}>
              Elegí un tema, leé lo que dice Frankie, mirá el esquema y probá la pregunta del final.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className={styles.explainTabs} role="tablist" aria-label="Temas">
            {TOPICS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active === index}
                className={cx(styles.explainTab, active === index && styles.explainTabActive)}
                onClick={() => setActive(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div key={topic.id} className={styles.explainBody} role="tabpanel">
          <Says>{topic.says}</Says>
          <div className={styles.extra}>
            {topic.viz}
            <Quiz key={topic.id} {...topic.quiz} />
          </div>
        </div>
      </div>
    </section>
  );
}
