import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { COMMUNITY_COLORS, cardSx } from "@/modules/community/styles/community.styles";
import Frankie from "@/shared/frankie/Frankie";
import FrankieSpeechBubble from "@/shared/frankie/FrankieSpeechBubble";
import { motivationOfTheDay } from "@/shared/frankie/frankie.copy";

const STORAGE_KEY = "knowlink.frankie.daily-message.dismissed";

/** Fecha local en formato AAAA-MM-DD (no UTC, para que "hoy" sea el día de quien lo lee). */
function todayKey(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function wasDismissedToday(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === todayKey();
  } catch {
    // Sin acceso a localStorage (modo privado, etc.): se muestra igual.
    return false;
  }
}

/**
 * Frase de ánimo del día, dicha por Frankie. Aparece una vez por día y se puede descartar:
 * acompaña sin interrumpir, y no vuelve a insistir hasta mañana.
 */
export default function FrankieDailyMessage() {
  const [hidden, setHidden] = useState(wasDismissedToday);

  if (hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, todayKey());
    } catch {
      // Si no se puede recordar, simplemente vuelve a aparecer en la próxima visita.
    }
  };

  return (
    <Box
      component="aside"
      aria-label="Mensaje de Frankie"
      sx={{
        ...cardSx,
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, md: 2.5 },
        position: "relative",
        background: `linear-gradient(135deg, #FFFFFF 0%, ${COMMUNITY_COLORS.panel} 100%)`,
      }}
    >
      <Frankie mood="love" size={104} style={{ marginLeft: -4 }} />
      <FrankieSpeechBubble tail="left" sx={{ flex: 1, minWidth: 0, pr: 5 }}>
        <Box
          component="span"
          sx={{ display: "block", fontSize: 11.5, color: COMMUNITY_COLORS.subtle }}
        >
          Frankie dice
        </Box>
        {motivationOfTheDay()}
      </FrankieSpeechBubble>
      <IconButton
        onClick={dismiss}
        size="small"
        aria-label="Ocultar el mensaje de hoy"
        sx={{ position: "absolute", top: 8, right: 8, color: COMMUNITY_COLORS.subtle }}
      >
        <X size={16} />
      </IconButton>
    </Box>
  );
}
