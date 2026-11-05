import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, SearchX } from "lucide-react";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import CommunityEmptyState from "@/modules/community/components/CommunityEmptyState";
import PostCard from "@/modules/community/components/PostCard";
import PostComposerCard from "@/modules/community/components/PostComposerCard";
import type { PostGuestAction } from "@/modules/community/types/post-guest-action.type";
import type { PostType } from "@/modules/community/types/post-type.type";
import Reveal from "@/modules/landing/components/Reveal";
import { DEMO_TUTORS, createDemoPosts } from "@/modules/landing/constants/demo-community";
import frankieUrl from "@/modules/landing/assets/frankie.webp";
import { useGuestGate } from "@/modules/landing/hooks/useGuestGate";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";
import { authPaths } from "@/routes/paths";

const TYPE_TABS: Array<{ value: PostType | null; label: string }> = [
  { value: null, label: "Todas" },
  { value: "HELP_REQUEST", label: "Dudas" },
  { value: "SHARED_CONTENT", label: "Aportes" },
];

const MEDAL_COLORS = ["#C9961A", "#8E96A8", "#B0703C"];

/**
 * Vista previa de la comunidad para visitantes: se puede mirar y filtrar, pero cualquier intento de
 * publicar, responder, reaccionar o reservar abre el aviso de Frankie para que se registren o ingresen.
 */
export default function CommunitySection() {
  const { requireAuth } = useGuestGate();
  // Las fechas son relativas al momento de entrar a la página, no se recalculan en cada render.
  const [now] = useState(() => Date.now());
  const posts = useMemo(() => createDemoPosts(now), [now]);
  const [type, setType] = useState<PostType | null>(null);
  const [subject, setSubject] = useState<string | null>(null);

  const subjects = useMemo(() => [...new Set(posts.map((post) => post.subject.name))], [posts]);
  const bySubject = useMemo(
    () => posts.filter((post) => subject === null || post.subject.name === subject),
    [posts, subject]
  );
  const visible = useMemo(
    () => bySubject.filter((post) => type === null || post.type === type),
    [bySubject, type]
  );
  const counts = {
    all: bySubject.length,
    HELP_REQUEST: bySubject.filter((post) => post.type === "HELP_REQUEST").length,
    SHARED_CONTENT: bySubject.filter((post) => post.type === "SHARED_CONTENT").length,
  };
  const hasFilters = type !== null || subject !== null;

  const handlePostAction = (action: PostGuestAction) => requireAuth(action);

  return (
    <section id="comunidad" className={cx(styles.section, styles.community)}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <Reveal>
              <div className={cx(styles.kicker, styles.mono)}>
                <b>04</b> Comunidad — aprender entre todos
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className={styles.h2}>
                Preguntá, respondé y <i>destacate</i>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div>
              <p className={styles.lead}>
                La comunidad es el lugar donde alumnos y tutores se ayudan entre sí: dudas
                puntuales, apuntes compartidos y un podio mensual para los tutores que más aportan.
              </p>
              <span className={styles.guestBadge}>
                <Eye size={16} aria-hidden />
                Vista de invitado: solo lectura
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal className={styles.frame}>
          <div className={styles.frameBar}>
            <span className={styles.frameDots} aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.frameTitle}>Comunidad Universitaria de Aprendizaje</span>
            <span className={styles.frameSpacer} />
            <span className={styles.frameGuest}>Ejemplo ilustrativo</span>
          </div>

          <div className={styles.communityGrid}>
            <div className={styles.feedCol}>
              <PostComposerCard displayName="Invitado" onCompose={() => requireAuth("post")} />

              <div className={styles.filterBar}>
                <div className={styles.tabsRow} role="group" aria-label="Tipo de consulta">
                  {TYPE_TABS.map((tab) => {
                    const count = tab.value === null ? counts.all : counts[tab.value];
                    return (
                      <button
                        key={tab.label}
                        type="button"
                        aria-pressed={type === tab.value}
                        className={cx(styles.tab, type === tab.value && styles.tabActive)}
                        onClick={() => setType(tab.value)}
                      >
                        {tab.label}
                        <span className={styles.tabCount}>{count}</span>
                      </button>
                    );
                  })}
                </div>
                <div className={styles.chipRow} role="group" aria-label="Materia">
                  {subjects.map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={subject === name}
                      className={cx(
                        styles.subjectChip,
                        subject === name && styles.subjectChipActive
                      )}
                      onClick={() => setSubject(subject === name ? null : name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {visible.length === 0 ? (
                <CommunityEmptyState
                  icon={<SearchX size={22} color="#5B6ED9" />}
                  message="No se encontraron publicaciones para los filtros seleccionados."
                  action={
                    hasFilters ? (
                      <button
                        type="button"
                        className={styles.subjectChip}
                        onClick={() => {
                          setType(null);
                          setSubject(null);
                        }}
                      >
                        Limpiar filtros
                      </button>
                    ) : undefined
                  }
                />
              ) : (
                visible.map((post) => (
                  <PostCard key={post.postId} post={post} onGuestAction={handlePostAction} />
                ))
              )}
            </div>

            <aside className={styles.sideCol}>
              <div className={styles.invite}>
                <img className={styles.inviteFrank} src={frankieUrl} alt="" width={92} />
                <h3>¿Te sumás a la conversación?</h3>
                <p>
                  Mirar es libre. Para publicar, responder, marcar «Esto me sirvió» o reservar con
                  un tutor necesitás una cuenta.
                </p>
                <div className={styles.inviteBtns}>
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
              </div>

              <div className={styles.panelCard}>
                <h3>Tutores destacados</h3>
                <p className={styles.muted}>Se destacan en la comunidad por sus aportes:</p>
                <div style={{ marginTop: 6 }}>
                  {DEMO_TUTORS.map(({ author, subjects: tutorSubjects }, index) => (
                    <div key={author.userId} className={styles.tutorRow}>
                      <span
                        className={styles.medal}
                        style={{ background: MEDAL_COLORS[index] }}
                        aria-label={`Puesto ${index + 1}`}
                      >
                        {index + 1}
                      </span>
                      <AuthorAvatar
                        fullName={author.fullName}
                        profilePictureUrl={null}
                        verified
                        size={38}
                      />
                      <div className={styles.tutorInfo}>
                        <div className={styles.tutorName}>{author.fullName}</div>
                        <div className={styles.tutorSubj}>{tutorSubjects}</div>
                        <div className={styles.tutorRating}>
                          ★ {author.averageRating?.toFixed(1)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.bookBtn}
                        aria-label={`Reservar una clase con ${author.fullName}`}
                        onClick={() => requireAuth("book")}
                      >
                        Reservar
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.subjectChip}
                  style={{ marginTop: 10 }}
                  onClick={() => requireAuth("podium")}
                >
                  Ver podio completo
                </button>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
