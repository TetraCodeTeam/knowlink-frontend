import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Calendar } from "lucide-react";

interface TutorAvailabilityCardProps {
  onVerDisponibilidad: () => void;
}

export const TutorAvailabilityCard = ({ onVerDisponibilidad }: TutorAvailabilityCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Calendar size={18} />
          <Typography variant="subtitle1" fontWeight={600}>
            Disponibilidad
          </Typography>
        </Stack>
        <Button variant="outlined" fullWidth onClick={onVerDisponibilidad}>
          Ver Disponibilidad Completa
        </Button>
      </CardContent>
    </Card>
  );
};