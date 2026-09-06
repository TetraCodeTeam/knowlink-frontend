import { Box, Chip, Rating, Typography, Stack } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import type { TutorSubjectRate } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import {
  MODALITY,
  MODALITY_DISPLAY_NAME,
  TUTOR_STATUS,
  TUTOR_STATUS_DISPLAY_NAME,
  PRICE_TAG,
} from "@/modules/student/tutorProfile/utils/tutor-tag-mapping";
import { formatCurrency } from "@/shared/utils/currency.utils";
import { useReviewDialogStore } from "@/modules/student/tutorProfile/hooks/useReviewDialogStore";

interface SubjectRateItemProps {
  subject: TutorSubjectRate;
}

const formatPrice = (price: number, isFree: boolean) => {
  if (isFree) return "Gratuita";
  return formatCurrency(price);
};

export const SubjectRateItem = ({ subject }: SubjectRateItemProps) => {
  const openDialog = useReviewDialogStore((state) => state.openDialog);
  const verifiedLabel = TUTOR_STATUS_DISPLAY_NAME.VERIFIED;
  const priceTag = subject.isFree ? PRICE_TAG.FREE : PRICE_TAG.PAID;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        p: 1.5,
        borderRadius: 1,
        bgcolor: "#F4F3FB",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={600}>
          {subject.name}
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center" mt={1} flexWrap="wrap" useFlexGap>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="nowrap" whiteSpace="nowrap">
            <Rating value={subject.rating} precision={0.1} readOnly size="small" />
            <Typography
              component="button"
              type="button"
              variant="subtitle1"
              color="primary"
              onClick={() => openDialog(subject.name)}
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                background: "none",
                border: 0,
                padding: 0,
                font: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              ({subject.reviewsCount} Reseñas)
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {subject.isVerified && (
            <Chip
              icon={<ShieldCheck size={14} />}
              label={verifiedLabel}
              size="small"
              variant="outlined"
              sx={{
                bgcolor: TUTOR_STATUS[verifiedLabel].bg,
                color: TUTOR_STATUS[verifiedLabel].color,
                borderColor: "transparent",
                fontSize: TUTOR_STATUS[verifiedLabel].fontSize,
                "& .MuiChip-icon": { color: TUTOR_STATUS[verifiedLabel].color },
              }}
            />
          )}
          {subject.modalities.map((modality) => {
            const modalityLabel = MODALITY_DISPLAY_NAME[modality];
            const tag = MODALITY[modalityLabel];
            const ModalityIcon = tag.icon;
            return (
              <Chip
                key={modality}
                label={modalityLabel}
                icon={ModalityIcon ? <ModalityIcon size={14} /> : undefined}
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: tag.bg,
                  color: tag.color,
                  borderColor: "transparent",
                  fontSize: tag.fontSize,
                  "& .MuiChip-icon": { color: tag.color },
                  py: 0.5,
                  px:0.5,
                }}
              />
            );
          })}
          </Stack>
        </Stack>
      </Box>

      <Chip
        label={formatPrice(subject.price, subject.isFree)}
        size="small"
        variant="outlined"
        sx={{
          bgcolor: priceTag.bg,
          color: priceTag.color,
          borderColor: "transparent",
          fontSize: priceTag.fontSize,
          fontWeight: 600,
        }}
      />
    </Box>
  );
};