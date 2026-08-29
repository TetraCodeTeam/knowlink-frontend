import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Calendar, CalendarCheck } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface TutorAvailabilityCardProps {
  onVerDisponibilidad: () => void;
}

export const TutorAvailabilityCard = ({ onVerDisponibilidad }: TutorAvailabilityCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Calendar size={25} color="#5865C8"/>
          <Typography variant="h5" fontWeight={500}>
            Disponibilidad
          </Typography>
        </Stack>
        <AppButton
          appVariant="primary"
          startIcon={<CalendarCheck size={18} color="#fff" />}
          fullWidth
          onClick={onVerDisponibilidad}
          sx={{ borderRadius: 1, fontWeight: 600 }}
        >
          Ver Disponibilidad Completa
        </AppButton>
      </CardContent>
    </Card>
  );
};