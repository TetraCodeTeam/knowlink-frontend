import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { cardSx } from "@/modules/community/styles/community.styles";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import type { FrankieAccessory, FrankieMood } from "@/shared/frankie/frankie.types";

interface CommunityEmptyStateProps {
  /** Expresión de Frankie según la situación (sin resultados, nada todavía, etc.). */
  mood: FrankieMood;
  accessories?: FrankieAccessory[];
  title?: string;
  message: string;
  /** Acción opcional bajo el mensaje (por ejemplo, limpiar filtros). */
  action?: ReactNode;
  /** Estira la tarjeta hasta ocupar el alto que le sobra a su contenedor. */
  fill?: boolean;
}

export default function CommunityEmptyState({
  mood,
  accessories,
  title,
  message,
  action,
  fill = false,
}: CommunityEmptyStateProps) {
  return (
    <Box sx={{ ...cardSx, display: "flex", ...(fill ? { flex: 1 } : {}) }}>
      <FrankieEmptyState
        compact
        fill
        mood={mood}
        accessories={accessories}
        size={210}
        title={title}
        message={message}
        action={action}
      />
    </Box>
  );
}
