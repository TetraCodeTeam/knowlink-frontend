import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";

interface ReviewItemProps {
  review: TutorReview;
  showSubject?: boolean;
}

export const ReviewItem = ({ review, showSubject = true }: ReviewItemProps) => {
  const hasSubject = Boolean(review.subject?.trim());

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: 1.5,
        borderRadius: 1,
        bgcolor: "#F4F3FB",
      }}
    >
      <Avatar src={review.studentAvatarUrl ?? undefined} alt={review.studentName} sx={{ width: 36, height: 36 }} />
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            {review.studentName}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
              {review.rating.toFixed(1)}
            </Typography>
          </Stack>
        </Stack>
        {showSubject && hasSubject && (
          <Typography variant="subtitle1" color="primary" display="block" mb={0.5}>
            {review.subject}
          </Typography>
        )}
        <Typography variant="subtitle1">"{review.comment}"</Typography>
      </Box>
    </Box>
  );
};