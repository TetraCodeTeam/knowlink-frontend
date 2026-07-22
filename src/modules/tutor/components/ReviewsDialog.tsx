import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { MessageSquare, X } from "lucide-react";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";
import { ReviewItem } from "@/modules/tutor/components/ReviewItem";
import { useReviewDialogStore } from "@/modules/tutor/hooks/useReviewDialogStore";
import { SubjectFilterBar } from "@/modules/tutor/components/subjectFilter";

interface ReviewsDialogProps {
  reviews: TutorReview[];
}

export const ReviewsDialog = ({ reviews }: ReviewsDialogProps) => {
  const { isOpen, subjectFilter, closeDialog, setSubjectFilter } = useReviewDialogStore();

  const subjects = Array.from(new Set(reviews.map((review) => review.subject).filter(Boolean)));
  const canFilterBySubject = subjects.length > 0;
  const filteredReviews = canFilterBySubject && subjectFilter ? reviews.filter((review) => review.subject === subjectFilter) : reviews;

  return (
    <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MessageSquare size={20} color="#5865C8" />
          <Typography variant="h6" fontWeight={600}>
            Reseñas
          </Typography>
        </Stack>
        <IconButton onClick={closeDialog} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 480 }}>
        {canFilterBySubject && (
          <Stack mb={2}>
            <SubjectFilterBar subjects={subjects} selected={subjectFilter} onSelect={setSubjectFilter} />
          </Stack>
        )}

        <Stack spacing={1.5}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => <ReviewItem key={review.id} review={review} showSubject={false} />)
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              No hay reseñas para esta materia todavía.
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};