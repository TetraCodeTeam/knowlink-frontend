import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { MessageSquare, X } from "lucide-react";
import { ReviewItem } from "@/modules/student/tutorProfile/components/ReviewItem";
import { ReviewsEmptyState } from "@/modules/student/tutorProfile/components/ReviewsEmptyState";
import { useReviewDialogStore } from "@/modules/student/tutorProfile/hooks/useReviewDialogStore";
import { useTutorRatingHistory } from "@/modules/student/tutorProfile/hooks/useTutorRatingHistory";

interface ReviewsDialogProps {
  tutorId: string;
  tutorName: string;
}

const PAGE_SIZE = 10;

export const ReviewsDialog = ({ tutorId, tutorName }: ReviewsDialogProps) => {
  const { isOpen, subjectFilter, closeDialog } = useReviewDialogStore();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isOpen) setPage(0);
  }, [isOpen, subjectFilter]);

  const isFilteredWithNoData = Boolean(subjectFilter) && !subjectFilter?.subjectId;

  const { data, isLoading } = useTutorRatingHistory(tutorId, {
    subjectId: subjectFilter?.subjectId ?? undefined,
    page,
    size: PAGE_SIZE,
    enabled: isOpen && !isFilteredWithNoData,
  });

  const comments = isFilteredWithNoData ? [] : (data?.comments.content ?? []);
  const totalPages = isFilteredWithNoData ? 0 : (data?.comments.totalPages ?? 0);
  const showLoading = isLoading && !isFilteredWithNoData;

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MessageSquare size={20} color="#5865C8" />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {subjectFilter ? "Reseñas de la Materia" : "Reseñas"}
            </Typography>
            {subjectFilter && (
              <Typography variant="subtitle2" color="primary" fontWeight={600}>
                {subjectFilter.subjectName}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton onClick={closeDialog} size="small" aria-label="Cerrar reseñas">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 480 }}>
        {showLoading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : comments.length > 0 ? (
          <Stack spacing={1.5}>
            {comments.map((review) => (
              <ReviewItem key={review.id} review={review} showSubject={!subjectFilter} />
            ))}
          </Stack>
        ) : (
          <ReviewsEmptyState tutorName={tutorName} />
        )}

        {totalPages > 1 && (
          <Stack alignItems="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_event, value) => setPage(value - 1)}
              size="small"
            />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};
