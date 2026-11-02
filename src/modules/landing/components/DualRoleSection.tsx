import { useState, type CSSProperties } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  BookOpenCheck,
  CalendarCheck,
  CalendarDays,
  Check,
  Library,
  MessagesSquare,
  Search,
  Upload,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/modules/landing/components/Reveal";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";
import type { Role } from "@/shared/types/role.type";

interface RoleView {
  label: string;
  title: string;
  text: string;
  items: Array<{ icon: LucideIcon; text: string }>;
}

const ROLE_VIEWS: Record<Role, RoleView> = {
  STUDENT: {
    label: "Alumno",
    title: "Estudiás con quien sabe",
    text: "Encontrás al tutor de cada materia, reservás una clase y te quedás con el material.",
    items: [
      { icon: Search, text: "Buscá tutores por materia y compará perfiles y calificaciones" },
      { icon: CalendarCheck, text: "Reservá clases de 1 a 3 horas, virtuales o presenciales" },
      { icon: Library, text: "Accedé al material de los tutores con quienes cursaste" },
      { icon: MessagesSquare, text: "Pedí ayuda en la comunidad cuando algo no sale" },
    ],
  },
  TUTOR: {
    label: "Tutor",
    title: "Enseñás lo que dominás",
    text: "Elegís qué materias das, cuándo atendés y si tus clases son gratuitas o con arancel.",
    items: [
      { icon: BookOpenCheck, text: "Elegí tus materias, la modalidad y si cobrás o no" },
      { icon: CalendarDays, text: "Armá tu agenda semanal de disponibilidad" },
      { icon: Upload, text: "Subí material de estudio y asocialo a cada materia" },
      { icon: BarChart3, text: "Seguí tus estadísticas y sumá puntos para el podio mensual" },
    ],
  },
};

const ROLES: Role[] = ["STUDENT", "TUTOR"];

const FACTS = [
  {
    title: "Una sola cuenta.",
    text: "El mismo usuario sirve para los dos roles: no hace falta registrarse dos veces.",
  },
  {
    title: "Activás el rol de tutor cuando quieras.",
    text: "Si ya lo tuviste, lo reactivás con la configuración que dejaste.",
  },
  {
    title: "Cambiás de vista sin cerrar sesión.",
    text: "Pasás de alumno a tutor (y volvés) con un clic desde la plataforma.",
  },
];

export default function DualRoleSection() {
  const [role, setRole] = useState<Role>("STUDENT");
  const view = ROLE_VIEWS[role];
  const other = role === "STUDENT" ? "TUTOR" : "STUDENT";

  return (
    <section id="rol-dual" className={cx(styles.section, styles.first)}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <Reveal>
              <div className={cx(styles.kicker, styles.mono)}>
                <b>01</b> Rol dual — una cuenta, dos caminos
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className={styles.h2}>
                Hoy aprendés, mañana <i>enseñás</i>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <p className={styles.lead}>
              En KnowLink no tenés que elegir para siempre. Quien estudia una materia puede ser el
              tutor de otra: con la misma cuenta pasás de buscar ayuda a darla.
            </p>
          </Reveal>
        </div>

        <div className={styles.dualGrid}>
          <Reveal>
            <div className={styles.dualCopy}>
              <div className={styles.roleTabs} role="tablist" aria-label="Elegí un rol">
                {ROLES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={role === value}
                    className={cx(styles.roleTab, role === value && styles.roleTabActive)}
                    onClick={() => setRole(value)}
                  >
                    {ROLE_VIEWS[value].label}
                  </button>
                ))}
              </div>
              <h3 key={role}>{view.title}</h3>
              <p>{view.text}</p>
              <ul className={styles.facts}>
                {FACTS.map((fact) => (
                  <li key={fact.title}>
                    <Check size={18} aria-hidden />
                    <span>
                      <b>{fact.title}</b> {fact.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className={styles.appWindow} role="tabpanel" aria-label={`Vista de ${view.label}`}>
              <div className={styles.winBar}>
                <span className={styles.winDots} aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={cx(styles.winTitle, styles.mono)}>KnowLink · tu cuenta</span>
              </div>
              <div className={styles.winBody}>
                <div className={styles.winHead}>
                  <div className={styles.who}>
                    <span className={styles.avatar} aria-hidden>
                      V
                    </span>
                    <span>
                      <span className={styles.whoName}>Valentina</span>
                      <br />
                      <span className={styles.whoSub}>valentina@ejemplo.com</span>
                    </span>
                  </div>
                  <span className={styles.modePill}>Modo {view.label.toLowerCase()}</span>
                </div>
                <ul className={styles.featList} key={role}>
                  {view.items.map((item, index) => (
                    <li
                      key={item.text}
                      className={styles.featItem}
                      style={{ "--i": index } as CSSProperties}
                    >
                      <span className={styles.featIcon} aria-hidden>
                        <item.icon size={18} />
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
                <button type="button" className={styles.switchBtn} onClick={() => setRole(other)}>
                  <ArrowLeftRight size={15} aria-hidden />
                  Cambiar a modo {ROLE_VIEWS[other].label.toLowerCase()}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
