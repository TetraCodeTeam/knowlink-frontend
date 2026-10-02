import { Avatar, Box, Chip, Rating, Stack, Typography } from "@mui/material";
import { getSubjectDisplayName, TUTOR_SUBJECT_TAG } from "@/modules/tutor/utils/tutor-tag-mapping";
import { CalendarCheck } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import type { TutorProfileHeaderProps } from "./interfaces/tutor-public-profile.interface";

export const TutorProfileHeader = ({ tutor, onBook }: TutorProfileHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={tutor.avatarUrl ?? undefined} alt={tutor.name} sx={{ width: 72, height: 72 }} />
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {tutor.name}
            </Typography>
            <Typography variant="h6" color="#494949" gutterBottom>
              Materias
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tutor.subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={getSubjectDisplayName(subject)}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: TUTOR_SUBJECT_TAG.bg,
                    color: TUTOR_SUBJECT_TAG.color,
                    fontSize: TUTOR_SUBJECT_TAG.fontSize,
                    borderColor: "transparent",
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Rating value={tutor.rating} precision={0.1} readOnly size="small" />
            <Typography variant="h6" fontWeight={600}>
              {tutor.rating}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ({tutor.reviewsCount} Reseñas)
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <AppButton
        appVariant="primary"
        onClick={onBook}
        startIcon={<CalendarCheck size={18} />}
        sx={{
          width: "60%",
          mx: "auto",
          mt: 2,
          fontSize: "16px",
          fontWeight: 600,
          borderRadius: 2,
        }}
      >
        Reservar Sesión
      </AppButton>
    </Box>
  );
};