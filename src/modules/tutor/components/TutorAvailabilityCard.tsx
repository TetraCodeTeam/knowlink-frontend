import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Calendar, CalendarCheck } from "lucide-react";

interface TutorAvailabilityCardProps {
  onVerDisponibilidad: () => void;
}

export const TutorAvailabilityCard = ({ onVerDisponibilidad }: TutorAvailabilityCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <Calendar size={18} color="#5865C8"/>
          <Typography variant="h6" fontWeight={600} color="#494949">
            Disponibilidad
          </Typography>
        </Stack>
        <Button startIcon={<CalendarCheck size={18} color="#fff" />} 
        variant="outlined" 
        fullWidth onClick={onVerDisponibilidad} 
        sx={{ borderRadius: 1, textTransform: "none", fontWeight: 600, bgcolor: "#5865C8", "&:hover": { bgcolor: "#4752C4" }, color: "#fff" }}>
          Ver Disponibilidad Completa
        </Button>
      </CardContent>
    </Card>
  );
};