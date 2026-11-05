import { Dialog } from "@mui/material";
import { X } from "lucide-react";
import { FRANKIE_SOURCES } from "@/modules/landing/constants/landing.constants";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";

interface AboutFrankieDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutFrankieDialog({ open, onClose }: AboutFrankieDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      aria-labelledby="about-frankie-title"
      slotProps={{
        paper: { sx: { bgcolor: "transparent", boxShadow: "none", borderRadius: "26px", m: 2 } },
        backdrop: { sx: { bgcolor: "rgba(8,10,40,.74)", backdropFilter: "blur(6px)" } },
      }}
    >
      <div className={styles.dialogIn}>
        <button type="button" className={styles.dialogClose} aria-label="Cerrar" onClick={onClose}>
          <X size={15} aria-hidden />
        </button>
        <p className={cx(styles.mono, styles.aboutKicker)}>
          Ballena franca austral · <i>Eubalaena australis</i>
        </p>
        <h2 id="about-frankie-title" className={styles.aboutTitle}>
          Sobre Frankie
        </h2>
        <p className={styles.aboutLede}>
          Frankie es una ballena franca austral, la especie que cada año vuelve a las aguas de
          Península Valdés, en Chubut, a parir y criar. La elegimos como mascota porque la vida de
          estas ballenas tiene mucho que ver con cómo se transmite el conocimiento.
        </p>
        <div className={styles.aboutGrid}>
          <section>
            <span className={styles.mono}>01 · Aprender</span>
            <h3>Se aprende de quien ya conoce el camino</h3>
            <p>
              Un estudio sobre ballenas francas australes concluyó que las crías aprenden de sus
              madres dónde alimentarse, y que esa preferencia se hereda por vía cultural durante
              varias generaciones. La ruta no se redescubre en cada generación: se transmite.
            </p>
          </section>
          <section>
            <span className={styles.mono}>02 · Conectar</span>
            <h3>Mantenerse en contacto</h3>
            <p>
              Se comunican con sonidos graves. El más documentado es el <i>up-call</i>, un llamado
              ascendente que se considera su señal principal de contacto. Entre madres y crías, en
              cambio, los llamados son suaves y poco frecuentes: sirven para coordinarse sin llamar
              la atención de los depredadores.
            </p>
          </section>
          <section>
            <span className={styles.mono}>03 · Reconocer</span>
            <h3>Cada una tiene su huella</h3>
            <p>
              Las callosidades de la cabeza, rugosidades que suelen verse blancas, forman un patrón
              distinto en cada ballena, como una huella digital. En 1970, Roger Payne desarrolló en
              Península Valdés la técnica para fotoidentificarlas, y desde entonces la ciencia las
              sigue una por una.
            </p>
          </section>
        </div>
        <p className={styles.aboutEnd}>
          Por eso nos acompaña Frankie:{" "}
          <i>nadie aprende solo, y todo recorrido empieza cuando alguien te muestra el camino.</i>
        </p>
        <p className={cx(styles.mono, styles.aboutSrc)}>
          Fuentes:{" "}
          {FRANKIE_SOURCES.map((source, index) => (
            <span key={source.href}>
              {index > 0 ? " · " : ""}
              <a href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </Dialog>
  );
}
