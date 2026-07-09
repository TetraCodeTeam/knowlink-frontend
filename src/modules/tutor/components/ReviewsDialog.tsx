import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { MessageSquare, X } from "lucide-react";
import type { TutorReview } from "@/modules/tutor/interfaces/tutor.interface";
import { ReviewItem } from "@/modules/tutor/components/ReviewItem";

interface ReviewsDialogProps {
  open: boolean;
  onClose: () => void;
  reviews: TutorReview[];
}

export const ReviewsDialog = ({ open, onClose, reviews }: ReviewsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MessageSquare size={20} color="#5865C8" />
          <Typography variant="h6" fontWeight={600}>
            Reseñas
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 480 }}>
        <Stack spacing={1.5} pt={1}>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};