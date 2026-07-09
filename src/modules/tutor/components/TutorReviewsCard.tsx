import { useState } from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { MessageSquare } from "lucide-react";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";
import { ReviewItem } from "@/modules/tutor/components/ReviewItem";
import { ReviewsDialog } from "@/modules/tutor/components/ReviewsDialog";

interface TutorReviewsCardProps {
  reviews: TutorReview[];
}

const PREVIEW_LIMIT = 5;
const VER_TODAS_THRESHOLD = 1;

export const TutorReviewsCard = ({ reviews }: TutorReviewsCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const previewReviews = reviews.slice(0, PREVIEW_LIMIT);
  const showVerTodas = reviews.length >= VER_TODAS_THRESHOLD;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MessageSquare size={18} color="#5865C8" />
            <Typography variant="h6" fontWeight={600}>
              Reseñas
            </Typography>
          </Stack>
          {showVerTodas && (
            <Button size="small" onClick={() => setDialogOpen(true)}>
              Ver Todas
            </Button>
          )}
        </Stack>

        <Stack spacing={2}>
          {previewReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </Stack>
      </CardContent>

      <ReviewsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} reviews={reviews} />
    </Card>
  );
};