import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  /** Ilustración del panel izquierdo (se oculta en mobile) */
  illustration?: ReactNode;
  /**
   * Stepper vertical entre ilustración y contenido.
   * Usado en los flujos de registro multi-paso (tutor / alumno).
   * Se oculta en mobile junto con la ilustración.
   */
  stepper?: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({ illustration, stepper, children }: AuthLayoutProps) {
  const hasLeftPanel = illustration || stepper;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0f172a",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(67,97,238,0.15) 0%, transparent 60%)",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 980,
          minHeight: 560,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Panel izquierdo: ilustración */}
        {illustration && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flex: "0 0 340px",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#eef2ff",
              p: 6,
            }}
          >
            {illustration}
          </Box>
        )}

        {/* Stepper vertical (entre ilustración y formulario) */}
        {stepper && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              py: 4,
            }}
          >
            {stepper}
          </Box>
        )}

        {/* Panel derecho: contenido de cada página */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: hasLeftPanel ? "flex-start" : "center",
            justifyContent: "center",
            p: { xs: 4, md: 6 },
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
}