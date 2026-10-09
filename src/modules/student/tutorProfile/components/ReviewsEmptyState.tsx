import { Box, Typography } from "@mui/material";

interface ReviewsEmptyStateProps {
  tutorName: string;
}

export const ReviewsEmptyState = ({ tutorName }: ReviewsEmptyStateProps) => (
  <Box
    sx={{
      textAlign: "center",
      borderRadius: 3,
      bgcolor: "#F4F3FB",
      py: 4,
      px: 2,
    }}
  >
    <Box
      component="img"
      src="/no-rate.png"
      alt="Sin reseñas"
      sx={{ width: 140, maxWidth: "60%", mx: "auto", display: "block", mb: 2 }}
    />
    <Typography variant="h6" fontWeight={600}>
      Este tutor aún no tiene reseñas
    </Typography>
    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
      Sé el primero en dejar una opinión después de completar tu sesión con {tutorName}.
    </Typography>
  </Box>
);
