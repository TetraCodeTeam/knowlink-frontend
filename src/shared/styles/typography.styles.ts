import type { SxProps, Theme } from "@mui/material";

/**
 * Escala tipográfica de las páginas, común a los tres roles. Cada módulo suma solo el color.
 * El menú lateral usa 14px: el título de página se queda a una escala cercana para que ninguno
 * de los dos compita con el otro.
 */
export const PAGE_TITLE_BASE_SX = {
  fontSize: { xs: 18, md: 20 },
  fontWeight: 700,
  lineHeight: 1.25,
} satisfies SxProps<Theme>;

export const PAGE_SUBTITLE_BASE_SX = {
  fontSize: 14,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;
