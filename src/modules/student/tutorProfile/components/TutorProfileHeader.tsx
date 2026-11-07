import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import type { TutorProfile } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import {
  getSubjectDisplayName,
  TUTOR_SUBJECT_TAG,
} from "@/modules/student/tutorProfile/utils/tutor-tag-mapping";
import { CalendarCheck } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface TutorProfileHeaderProps {
  tutor: TutorProfile;
  onReservar: () => void;
}

export const TutorProfileHeader = ({ tutor, onReservar }: TutorProfileHeaderProps) => {
  const avatarInitial = tutor.name.trim().charAt(0).toUpperCase();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          p: { xs: 1.75, md: 2 },
          "&:last-child": { pb: { xs: 1.75, md: 2 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={{ xs: 1.5, md: 2 }} alignItems="center">
            <Avatar
              src={tutor.avatarUrl ?? undefined}
              alt={tutor.name}
              sx={{ width: { xs: 64, md: 84 }, height: { xs: 64, md: 84 } }}
            >
              {avatarInitial}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontSize={{ xs: 22, md: 26 }} fontWeight={500} lineHeight={1.2}>
                {tutor.name}
              </Typography>
              <Typography fontSize={15} color="#494949" mb={0.5}>
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
                      px: 0.25,
                      py: 1,
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
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              flexWrap="nowrap"
              whiteSpace="nowrap"
            >
              <Rating value={tutor.rating} precision={0.1} readOnly size="small" />
              <Typography fontSize={16} fontWeight={600}>
                {tutor.rating}
              </Typography>
              <Typography fontSize={13} color="text.secondary" whiteSpace="nowrap">
                ({tutor.reviewsCount} Reseñas)
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider
          sx={{
            my: 0.5,
            width: "80%",
            bgcolor: "#EEEEEE",
            marginX: "auto",
            borderBottom: "1px",
            height: "1px",
          }}
        />

        <AppButton
          appVariant="primary"
          onClick={onReservar}
          startIcon={<CalendarCheck size={16} />}
          sx={{
            width: { xs: "100%", sm: "70%" },
            mx: "auto",
            py: 0.75,
            fontSize: "15px",
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
