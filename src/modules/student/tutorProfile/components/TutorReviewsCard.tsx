import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { MessagesSquare } from "lucide-react";
import type { TutorReview } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import { ReviewItem } from "@/modules/student/tutorProfile/components/ReviewItem";
import { ReviewsEmptyState } from "@/modules/student/tutorProfile/components/ReviewsEmptyState";
import { useReviewDialogStore } from "@/modules/student/tutorProfile/hooks/useReviewDialogStore";

interface TutorReviewsCardProps {
  reviews: TutorReview[];
  reviewsTotalElements: number;
  hasRatings: boolean;
  tutorName: string;
}

const PREVIEW_LIMIT = 3;

export const TutorReviewsCard = ({
  reviews,
  reviewsTotalElements,
  hasRatings,
  tutorName,
}: TutorReviewsCardProps) => {
  const openDialog = useReviewDialogStore((state) => state.openDialog);
  const previewReviews = reviews.slice(0, PREVIEW_LIMIT);
  const showVerTodas = reviewsTotalElements > PREVIEW_LIMIT;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MessagesSquare size={25} color="#5865C8" />
            <Typography variant="h5" fontWeight={500}>
              Reseñas
            </Typography>
          </Stack>
          {showVerTodas && (
            <Button size="small" onClick={() => openDialog()} sx={{ textTransform: "none", fontSize: 16 }}>
              Ver Todas
            </Button>
          )}
        </Stack>

        {hasRatings && previewReviews.length > 0 ? (
          <Stack spacing={2}>
            {previewReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </Stack>
        ) : (
          <ReviewsEmptyState tutorName={tutorName} />
        )}
      </CardContent>
    </Card>
  );
};
