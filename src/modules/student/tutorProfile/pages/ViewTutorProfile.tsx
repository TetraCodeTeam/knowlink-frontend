import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { TutorProfileHeader } from "@/modules/student/tutorProfile/components/TutorProfileHeader";
import { TutorAboutCard } from "@/modules/student/tutorProfile/components/TutorAboutCard";
import { TutorSubjectsCard } from "@/modules/student/tutorProfile/components/TutorSubjectsCard";
import { TutorMaterialCard } from "@/modules/student/tutorProfile/components/TutorMaterialCard";
import { TutorReviewsCard } from "@/modules/student/tutorProfile/components/TutorReviewsCard";
import { useTutorProfile } from "@/modules/student/tutorProfile/hooks/useTutorProfile";
import { ReviewsDialog } from "@/modules/student/tutorProfile/components/ReviewsDialog";

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
    navigate(`/student/tutor/${tutorId}/booking`);
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 1900, mx: "auto", p: { xs: 1, sm: 4 }, bgcolor: "#F4F3FB" }}>
      <TutorProfileHeader tutor={tutor} onReservar={handleReservar} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            <TutorAboutCard about={tutor.about} />
            <TutorSubjectsCard subjectRates={tutor.subjectRates} />
            <TutorReviewsCard reviews={tutor.reviews} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={5}>
            <TutorMaterialCard material={tutor.material} hasConfirmedBooking={tutor.hasConfirmedBooking} />
          </Stack>
        </Grid>
      </Grid>
      <ReviewsDialog reviews={tutor.reviews} />
    </Stack>
  );
};
