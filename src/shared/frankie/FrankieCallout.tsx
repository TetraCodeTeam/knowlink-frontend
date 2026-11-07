import type { ReactNode } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import Frankie from "@/shared/frankie/Frankie";
import { MOOD_BY_KIND, type FeedbackKind } from "@/shared/frankie/frankie.copy";

interface FrankieCalloutProps {
  kind?: FeedbackKind;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const PALETTE: Record<FeedbackKind, { bg: string; border: string }> = {
  info: { bg: "#F1F3FD", border: "#DCE1FA" },
  warning: { bg: "#FFF6E8", border: "#F5DDB4" },
  error: { bg: "#FDEDEE", border: "#F4C7CA" },
  success: { bg: "#E8F6EF", border: "#C3E6D4" },
};

/**
 * Nota dentro de una pantalla (reemplaza al `Alert` de MUI): Frankie la dice con su cara,
 * así la advertencia suena a recomendación amiga y no a bloqueo.
 */
export default function FrankieCallout({ kind = "info", children, sx }: FrankieCalloutProps) {
  const { bg, border } = PALETTE[kind];
  return (
    <Box
      role={kind === "error" || kind === "warning" ? "alert" : "note"}
      sx={[
        {
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          p: 1.5,
          borderRadius: "14px",
          bgcolor: bg,
          border: `1px solid ${border}`,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Frankie mood={MOOD_BY_KIND[kind]} crop="face" size={40} />
      <Box sx={{ minWidth: 0, flex: 1 }}>{children}</Box>
    </Box>
  );
}
