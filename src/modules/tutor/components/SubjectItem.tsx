import { Box, Chip, Rating, Typography, Stack } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import type { TutorSubjectRate } from "@/modules/tutor/interfaces/tutor.interface";
import {
  MODALITY,
  MODALITY_DISPLAY_NAME,
  TUTOR_STATUS,
  TUTOR_STATUS_DISPLAY_NAME,
  PRICE_TAG,
} from "@/modules/tutor/utils/tutor-tag-mapping";
import { useReviewsDialogStore } from "@/modules/tutor/hooks/useReviewDialogStore";

interface SubjectRateItemProps {
  subject: TutorSubjectRate;
}

const formatPrice = (price: number, isFree: boolean) => {
  if (isFree) return "Gratuita";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    price,
  );
};

export const SubjectRateItem = ({ subject }: SubjectRateItemProps) => {
  const openDialog = useReviewsDialogStore((state) => state.openDialog);
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
        <Typography variant="h5" fontWeight={520}>
          {subject.name}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Rating value={subject.rating} precision={0.1} readOnly size="small" />
          <Typography
            variant="subtitle1"
            color="primary"
            onClick={() => openDialog(subject.name)}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            ({subject.reviewsCount} Reseñas)
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap" useFlexGap>
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
                }}
              />
            );
          })}
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