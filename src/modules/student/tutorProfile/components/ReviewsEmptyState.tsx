import { Box } from "@mui/material";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";

interface ReviewsEmptyStateProps {
  tutorName: string;
}

export const ReviewsEmptyState = ({ tutorName }: ReviewsEmptyStateProps) => (
  <Box sx={{ borderRadius: 3, bgcolor: "#F4F3FB" }}>
    <FrankieEmptyState
      compact
      mood="love"
      size={200}
      title="Este tutor aún no tiene reseñas"
      message={`Sé el primero en dejar una opinión después de completar tu sesión con ${tutorName}.`}
    />
  </Box>
);
