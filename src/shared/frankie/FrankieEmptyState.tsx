import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import Frankie from "@/shared/frankie/Frankie";
import type { FrankieAccessory, FrankieMood } from "@/shared/frankie/frankie.types";

interface FrankieEmptyStateProps {
  mood?: FrankieMood;
  accessories?: FrankieAccessory[];
  /** Título corto y cálido (opcional). */
  title?: string;
  message: ReactNode;
  /** Siguiente paso sugerido: normalmente un botón. */
  action?: ReactNode;
  /** Ancho de Frankie en px. */
  size?: number;
  /** Cuando el contenedor es chico (tarjetas, paneles): menos aire alrededor. */
  compact?: boolean;
  /** Se estira para ocupar el alto que le sobra a su contenedor. */
  fill?: boolean;
}

/**
 * Estado vacío con Frankie: lo acompaña, explica por qué no hay nada y sugiere qué hacer después.
 * Es el único lugar donde se resuelve este patrón; las pantallas solo eligen ánimo y texto.
 */
export default function FrankieEmptyState({
  mood = "sleepy",
  accessories,
  title,
  message,
  action,
  size = 200,
  compact = false,
  fill = false,
}: FrankieEmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: compact ? 0.5 : 1,
        py: compact ? 3 : 6,
        px: 2,
        textAlign: "center",
        ...(fill ? { flex: 1 } : {}),
      }}
    >
      <Frankie
        mood={mood}
        accessories={accessories}
        size={compact ? Math.round(size * 0.75) : size}
        entrance
      />
      {title ? (
        <Typography
          component="h2"
          sx={{ fontSize: compact ? 16 : 19, fontWeight: 700, color: "#1A1A2E", mt: 0.5 }}
        >
          {title}
        </Typography>
      ) : null}
      <Typography
        component="div"
        sx={{ fontSize: compact ? 14 : 15, color: "#6B6B80", maxWidth: 420, lineHeight: 1.55 }}
      >
        {message}
      </Typography>
      {action ? <Box sx={{ mt: 1.5 }}>{action}</Box> : null}
    </Box>
  );
}
