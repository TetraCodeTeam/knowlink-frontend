import { Avatar, Box, Card, CardContent, Chip, Divider, Rating, Stack, Typography } from "@mui/material";
import { getSubjectDisplayName, TUTOR_SUBJECT_TAG } from "@/modules/student/tutorProfile/utils/tutor-tag-mapping";
import { CalendarCheck } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import type { TutorProfileHeaderProps } from "./interfaces/tutor-public-profile.interface";

export const TutorProfileHeader = ({ tutor, onBook }: TutorProfileHeaderProps) => {
  const avatarInitial = tutor.name.trim().charAt(0).toUpperCase();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar src={tutor.avatarUrl ?? undefined} alt={tutor.name} sx={{ width: 120, height: 120 }}>
            {avatarInitial}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={500}>
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
                    px: 1,
                    py:1.5,
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
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="nowrap" whiteSpace="nowrap">
            <Rating value={tutor.rating} precision={0.1} readOnly size="medium" />
            <Typography variant="h6" fontWeight={600}>
              {tutor.rating}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" whiteSpace="nowrap">
              ({tutor.reviewsCount} Reseñas)
            </Typography>
          </Stack>
        </Stack>
        </Box>

      <Divider sx={{ my: 1, width: "80%", bgcolor: "#EEEEEE", marginX: "auto", borderBottom: "1px", height: "1px" }} />

      <AppButton
        appVariant="primary"
        onClick={onBook}
        startIcon={<CalendarCheck size={18} />}
        sx={{
          width: "70%",
          mx: "auto",
          fontSize: "16px",
          fontWeight: 600,
          borderRadius: 2,
        }}
      >
        Reservar Sesión
      </AppButton>
      </CardContent>
    </Card>
  );
};