import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "@/shared/components/AppButton";
import Frankie from "@/shared/frankie/Frankie";
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
      <Frankie mood="thinking" size={220} entrance style={{ marginBottom: 12 }} />
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
