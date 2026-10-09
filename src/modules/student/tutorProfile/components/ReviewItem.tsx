import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import type { TutorReview } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

interface ReviewItemProps {
  review: TutorReview;
  showSubject?: boolean;
}

export const ReviewItem = ({ review, showSubject = true }: ReviewItemProps) => {
  const hasSubject = Boolean(review.subject?.trim());

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "#F4F3FB",
        border: "1px solid #E0E0FA",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={review.studentAvatarUrl ?? undefined}
          alt={review.studentName}
          sx={{ width: 56, height: 56 }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {review.studentName}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Rating
                value={review.rating}
                readOnly
                size="small"
                sx={{ color: "primary.main" }}
              />
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                {review.rating.toFixed(1)}
              </Typography>
            </Stack>
          </Stack>
          {showSubject && hasSubject && (
            <Typography variant="subtitle1" color="primary" fontWeight={600} display="block">
              {review.subject}
            </Typography>
          )}
        </Box>
      </Stack>
      <Typography variant="subtitle1" sx={{ color: "grey.600", mt: 1 }}>
        &quot;{review.comment}&quot;
      </Typography>
    </Box>
  );
};
