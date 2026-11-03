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
        p: 1.5,
        borderRadius: 3,
        bgcolor: "#F4F3FB",
        border: "1px solid #E0E0FA",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={review.studentAvatarUrl ?? undefined}
          alt={review.studentName}
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize={15} fontWeight={600}>
              {review.studentName}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Rating value={review.rating} readOnly size="small" sx={{ color: "primary.main" }} />
              <Typography fontSize={13} fontWeight={600} color="text.secondary">
                {review.rating.toFixed(1)}
              </Typography>
            </Stack>
          </Stack>
          {showSubject && hasSubject && (
            <Typography fontSize={13} color="primary" fontWeight={600} display="block">
              {review.subject}
            </Typography>
          )}
        </Box>
      </Stack>
      <Typography sx={{ fontSize: 14, color: "grey.600", mt: 0.75 }}>
        &quot;{review.comment}&quot;
      </Typography>
    </Box>
  );
};
