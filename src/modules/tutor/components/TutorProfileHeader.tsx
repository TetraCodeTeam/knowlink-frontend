import { Avatar, Box, Button, Chip, Rating, Stack, Typography } from "@mui/material";
import type { TutorProfile } from "@/modules/tutor/interfaces/tutor.interface";
import { getSubjectDisplayName, TUTOR_SUBJECT_TAG_COLOR } from "@/modules/tutor/utils/tutor-tag-mapping";
import { CalendarCheck } from "lucide-react";

interface TutorProfileHeaderProps {
  tutor: TutorProfile;
  onReservar: () => void;
}

export const TutorProfileHeader = ({ tutor, onReservar }: TutorProfileHeaderProps) => {
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
            <Typography variant="h6" fontWeight={600}>
              {tutor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
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
                    bgcolor: TUTOR_SUBJECT_TAG_COLOR.bg,
                    color: TUTOR_SUBJECT_TAG_COLOR.color,
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
            <Typography variant="body2" fontWeight={600}>
              {tutor.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({tutor.reviewsCount} Reseñas)
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Button
        variant="contained"
        onClick={onReservar}
        startIcon={<CalendarCheck size={18} />}
        sx={{width:"60%", mx: "auto", mt:2, bgcolor: "#5865C8", "&:hover": { bgcolor: "#4752C4" }, fontSize: "16px", fontWeight: 600, textTransform: "none", cornerRadius: 2}}
      >
        Reservar Sesión
      </Button>
    </Box>
  );
};