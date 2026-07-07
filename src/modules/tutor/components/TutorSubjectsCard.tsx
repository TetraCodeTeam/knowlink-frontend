import { Box, Button, Card, CardContent, Chip, Rating, Stack, Typography } from "@mui/material";
import { BookOpen, ShieldCheck } from "lucide-react";
import type { TutorSubjectRate } from "@/modules/tutor/interfaces/tutor.interface";
import {
  MODALITY_COLORS,
  MODALITY_DISPLAY_NAME,
  TUTOR_STATUS_COLORS,
  TUTOR_STATUS_DISPLAY_NAME,
} from "@/modules/tutor/utils/tutor-tag-mapping";

interface TutorSubjectsCardProps {
  subjectRates: TutorSubjectRate[];
  onVerTodas?: () => void;
}

const formatPrice = (price: number, isFree: boolean) => {
  if (isFree) return "Gratuita";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    price,
  );
};

export const TutorSubjectsCard = ({ subjectRates, onVerTodas }: TutorSubjectsCardProps) => {
  const verifiedLabel = TUTOR_STATUS_DISPLAY_NAME.VERIFIED;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BookOpen size={18} />
            <Typography variant="subtitle1" fontWeight={600}>
              Materias y Tarifas
            </Typography>
          </Stack>
          {onVerTodas && (
            <Button size="small" onClick={onVerTodas}>
              Ver Todas
            </Button>
          )}
        </Stack>

        <Stack spacing={1.5}>
          {subjectRates.map((subject) => (
            <Box
              key={subject.id}
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
                <Typography variant="body2" fontWeight={600}>
                  {subject.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Rating value={subject.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
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
                        bgcolor: TUTOR_STATUS_COLORS[verifiedLabel].bg,
                        color: TUTOR_STATUS_COLORS[verifiedLabel].color,
                        borderColor: "transparent",
                        "& .MuiChip-icon": {
                          color: TUTOR_STATUS_COLORS[verifiedLabel].color,
                        },
                      }}
                    />
                  )}
                  {subject.modalities.map((modality) => (
                    <Chip
                      key={modality}
                      label={MODALITY_DISPLAY_NAME[modality]}
                      size="small"
                      variant="outlined"
                      sx={{
                        bgcolor: MODALITY_COLORS[MODALITY_DISPLAY_NAME[modality]].bg,
                        color: MODALITY_COLORS[MODALITY_DISPLAY_NAME[modality]].color,
                        borderColor: "transparent",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
              <Typography variant="body2" fontWeight={600} color={subject.isFree ? "success.main" : "text.primary"}>
                {formatPrice(subject.price, subject.isFree)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};