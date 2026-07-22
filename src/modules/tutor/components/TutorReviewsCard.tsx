import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { MessageSquare } from "lucide-react";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";
import { ReviewItem } from "@/modules/tutor/components/ReviewItem";
import { useReviewsDialogStore } from "@/modules/tutor/hooks/useReviewDialogStore";

interface TutorReviewsCardProps {
  reviews: TutorReview[];
}

const PREVIEW_LIMIT = 3;
const VER_TODAS_THRESHOLD = 5;

export const TutorReviewsCard = ({ reviews }: TutorReviewsCardProps) => {
  const openDialog = useReviewsDialogStore((state) => state.openDialog);
  const previewReviews = reviews.slice(0, PREVIEW_LIMIT);
  const showVerTodas = reviews.length >= VER_TODAS_THRESHOLD;
  const hasReviews = reviews.length > 0;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MessageSquare size={18} color="#5865C8" />
            <Typography variant="h5" fontWeight={600}>
              Reseñas
            </Typography>
          </Stack>
          {showVerTodas && (
            <Button size="small" onClick={() => openDialog()}>
              Ver Todas
            </Button>
          )}
        </Stack>

        {hasReviews ? (
          <Stack spacing={2}>
            {previewReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box sx={{ opacity: 0.5, display: "inline-flex" }}>
              <MessageSquare size={32} color="#5865C8" />
            </Box>
            <Typography variant="h6" fontWeight={550} mt={1}>
              Sin reseñas todavía
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Este tutor todavía no recibió reseñas de otros estudiantes.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

