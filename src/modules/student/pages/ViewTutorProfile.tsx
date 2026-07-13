import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { TutorProfileHeader } from "@/modules/tutor/components/TutorProfileHeader";
import { TutorAboutCard } from "@/modules/tutor/components/TutorAboutCard";
import { TutorSubjectsCard } from "@/modules/tutor/components/TutorSubjectsCard";
import { TutorAvailabilityCard } from "@/modules/tutor/components/TutorAvailabilityCard";
import { TutorMaterialCard } from "@/modules/tutor/components/TutorMaterialCard";
import { TutorReviewsCard } from "@/modules/tutor/components/TutorReviewsCard";
import { useTutorProfile } from "@/modules/tutor/hooks/useTutorProfile";

export const TutorProfilePage = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { data: tutor, isLoading, isError } = useTutorProfile(tutorId ?? "");

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !tutor) {
    return (
      <Box textAlign="center" py={8}>
        <Typography color="error">No se pudo cargar el perfil del tutor.</Typography>
      </Box>
    );
  }

  const handleReservar = () => {
    // TODO: conectar con el flujo de reserva (modulo "reservas")
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 1900, mx: "auto", p: { xs: 1, sm: 3 }, bgcolor: "#F4F3FB" }}>
      <TutorProfileHeader tutor={tutor} onReservar={handleReservar} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            <TutorAboutCard about={tutor.about} />
            <TutorSubjectsCard subjectRates={tutor.subjectRates} />
            <TutorReviewsCard reviews={tutor.reviews} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <TutorAvailabilityCard onVerDisponibilidad={() => navigate("disponibilidad")} />
            <TutorMaterialCard material={tutor.material} hasConfirmedBooking={tutor.hasConfirmedBooking} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};