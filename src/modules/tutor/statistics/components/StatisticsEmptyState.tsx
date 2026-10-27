import { Box, Typography } from "@mui/material";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppButton from "@/shared/components/AppButton";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import { TUTOR_STATISTICS_PATHS } from "@/modules/tutor/statistics/constants/statistics.constants";
import { cardSx } from "@/modules/tutor/statistics/styles/statistics.styles";

export default function StatisticsEmptyState() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      aria-label="Sin actividad en el período"
      sx={{
        ...cardSx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: { xs: 6, md: 8 },
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          bgcolor: STATISTICS_COLORS.starTrack,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <BarChart3 size={40} color={STATISTICS_COLORS.primary} aria-hidden />
      </Box>
      <Typography component="h2" sx={{ fontSize: 22, fontWeight: 600, mb: 1.5 }}>
        Todavía no tenés actividad en este período
      </Typography>
      <Typography sx={{ maxWidth: 460, color: STATISTICS_COLORS.textMuted, mb: 3 }}>
        Cuando completes sesiones, recibas calificaciones o se registren cancelaciones, vas a ver
        tus estadísticas acá. Probá con un período más amplio o sumá horarios para recibir reservas.
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <AppButton onClick={() => navigate(TUTOR_STATISTICS_PATHS.availability)}>
          Ir a Mi disponibilidad
        </AppButton>
        <AppButton
          appVariant="outline"
          onClick={() => navigate(TUTOR_STATISTICS_PATHS.classHistory)}
        >
          Ver todo el historial
        </AppButton>
      </Box>
    </Box>
  );
}
