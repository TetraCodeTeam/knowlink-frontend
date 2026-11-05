import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@mui/material";
import { ArrowRight, X } from "lucide-react";
import frankieUrl from "@/modules/landing/assets/frankie.webp";
import {
  GUEST_ACTION_COPY,
  type GuestAction,
} from "@/modules/landing/constants/guest-actions.constants";
import styles from "@/modules/landing/styles/sections.module.css";
import { cx } from "@/modules/landing/utils/cx";
import { authPaths } from "@/routes/paths";

interface GuestPromptDialogProps {
  /** Acción que el invitado intentó hacer; null = diálogo cerrado. */
  action: GuestAction | null;
  onClose: () => void;
}

/**
 * Aviso amigable para quien todavía no inició sesión: Frankie le cuenta que esa acción necesita una cuenta
 * y le ofrece registrarse, ingresar o seguir mirando.
 */
export default function GuestPromptDialog({ action, onClose }: GuestPromptDialogProps) {
  const navigate = useNavigate();
  // Conserva el último texto mientras el diálogo se cierra, para que no parpadee al desvanecerse.
  const lastAction = useRef<GuestAction>("post");
  if (action) lastAction.current = action;
  const copy = GUEST_ACTION_COPY[lastAction.current];

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Dialog
      open={action !== null}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="guest-prompt-title"
      slotProps={{
        paper: { sx: { bgcolor: "transparent", boxShadow: "none", borderRadius: "26px", m: 2 } },
        backdrop: { sx: { bgcolor: "rgba(8,10,40,.74)", backdropFilter: "blur(6px)" } },
      }}
    >
      <div className={cx(styles.dialogIn, styles.guestIn)}>
        <button type="button" className={styles.dialogClose} aria-label="Cerrar" onClick={onClose}>
          <X size={15} aria-hidden />
        </button>
        <img className={styles.guestFrank} src={frankieUrl} alt="" width={150} />
        <h2 id="guest-prompt-title" className={styles.guestTitle}>
          {copy.title}
        </h2>
        <p className={styles.guestBody}>
          {copy.body} La comunidad se puede mirar sin registrarse, pero participar es para quienes
          tienen cuenta.
        </p>
        <div className={styles.guestBtns}>
          <button type="button" className={styles.btnO} onClick={() => go(authPaths.register)}>
            Crear mi cuenta
            <span className={styles.ar}>
              <ArrowRight size={14} aria-hidden />
            </span>
          </button>
          <button type="button" className={styles.btnGhost} onClick={() => go(authPaths.login)}>
            Ya tengo cuenta, ingresar
          </button>
        </div>
        <button type="button" className={styles.guestSkip} onClick={onClose}>
          Seguir mirando
        </button>
      </div>
    </Dialog>
  );
}
