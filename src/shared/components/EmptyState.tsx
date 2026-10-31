import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  /** Ilustración a mostrar. Tiene prioridad sobre `icon` si se pasan ambos. */
  image?: string;
  imageAlt?: string;
  /** Fallback cuando no hay ilustración disponible (ej. un ícono de MUI). */
  icon?: ReactNode;
  message: string;
}

export default function EmptyState({ image, imageAlt, icon, message }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 8,
        textAlign: "center",
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={imageAlt ?? ""}
          sx={{ width: { xs: 180, sm: 220 }, height: "auto" }}
        />
      ) : icon ? (
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#EDEBFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 320 }}>
        {message}
      </Typography>
    </Box>
  );
}
