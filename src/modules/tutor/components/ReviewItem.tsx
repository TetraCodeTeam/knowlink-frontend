import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";

interface ReviewItemProps {
  review: TutorReview;
  showSubject?: boolean;
}

export const ReviewItem = ({ review, showSubject = true }: ReviewItemProps) => {
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
          <Typography variant="subtitle1" fontWeight={600}>
            {review.studentName}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              {review.rating.toFixed(1)}
            </Typography>
          </Stack>
        </Stack>
        {showSubject && (
          <Typography variant="caption" color="primary" display="block" mb={0.5}>
            {review.subject}
          </Typography>
        )}
        <Typography variant="body2">"{review.comment}"</Typography>
      </Box>
    </Box>
  );
};