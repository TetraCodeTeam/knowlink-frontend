import type { ReactNode } from "react";
import { Box } from "@mui/material";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import type { FrankieAccessory, FrankieMood } from "@/shared/frankie/frankie.types";

interface FrankieErrorPageProps {
  mood?: FrankieMood;
  accessories?: FrankieAccessory[];
  title: string;
  message: string;
  actions: ReactNode;
  /** Dentro de un layout (con menú y barra superior): no ocupa toda la pantalla ni pinta fondo. */
  embedded?: boolean;
}

/** Pantalla completa para fallos que no se resuelven dentro de una sección (404, error fatal). */
export default function FrankieErrorPage({
  mood = "sad",
  accessories,
  title,
  message,
  actions,
  embedded = false,
}: FrankieErrorPageProps) {
  return (
    <Box
      role="alert"
      sx={{
        minHeight: embedded ? "70vh" : "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: embedded ? "transparent" : "#F4F3FB",
        p: 3,
      }}
    >
      <FrankieEmptyState
        mood={mood}
        accessories={accessories}
        size={360}
        title={title}
        message={message}
        action={
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
            {actions}
          </Box>
        }
      />
    </Box>
  );
}
