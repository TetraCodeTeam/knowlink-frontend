import { Avatar, Box, Button, Card, CardContent, Rating, Stack, Typography } from "@mui/material";
import { MessageSquare } from "lucide-react";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";

interface TutorReviewsCardProps {
  reviews: TutorReview[];
  onVerTodas?: () => void;
}

export const TutorReviewsCard = ({ reviews, onVerTodas }: TutorReviewsCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MessageSquare size={18} />
            <Typography variant="subtitle1" fontWeight={600}>
              Reseñas
            </Typography>
          </Stack>
          {onVerTodas && (
            <Button size="small" onClick={onVerTodas}>
              Ver Todas
            </Button>
          )}
        </Stack>

        <Stack spacing={2}>
          {reviews.map((review) => (
            <Box key={review.id} sx={{ display: "flex", gap: 1.5 }}>
              <Avatar src={review.studentAvatarUrl ?? undefined} alt={review.studentName} sx={{ width: 36, height: 36 }} />
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600}>
                    {review.studentName}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  {review.subject}
                </Typography>
                <Typography variant="body2">{review.comment}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};