import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Calendar, CalendarCheck } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import type { TutorAvailabilityCardProps } from "./interfaces/tutor-public-profile.interface";

export const TutorAvailabilityCard = ({ onViewAvailability }: TutorAvailabilityCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Calendar size={18} color="#5865C8"/>
          <Typography variant="h5" fontWeight={600}>
            Disponibilidad
          </Typography>
        </Stack>
        <AppButton
          appVariant="primary"
          startIcon={<CalendarCheck size={18} color="#fff" />}
          fullWidth
          onClick={onViewAvailability}
          sx={{ borderRadius: 1, fontWeight: 600 }}
        >
          Ver Disponibilidad Completa
        </AppButton>
      </CardContent>
    </Card>
  );
};