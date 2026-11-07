import { Box } from "@mui/material";
import Frankie from "@/shared/frankie/Frankie";
import FrankieSpeechBubble from "@/shared/frankie/FrankieSpeechBubble";
import type { FrankieAccessory, FrankieMood } from "@/shared/frankie/frankie.types";

interface FrankieIllustrationProps {
  mood?: FrankieMood;
  accessories?: FrankieAccessory[];
  /** Lo que Frankie le dice a quien mira la pantalla. */
  message?: string;
  /** Ancho máximo de Frankie en px. */
  maxWidth?: number;
}

/** Frankie como ilustración principal de una pantalla (login, registro, edición de perfil). */
export default function FrankieIllustration({
  mood = "happy",
  accessories,
  message,
  maxWidth = 360,
}: FrankieIllustrationProps) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.75,
        px: 3,
      }}
    >
      {message ? (
        <FrankieSpeechBubble sx={{ textAlign: "center", maxWidth: 320 }}>
          {message}
        </FrankieSpeechBubble>
      ) : null}
      <Frankie mood={mood} accessories={accessories} size="100%" entrance />
    </Box>
  );
}
