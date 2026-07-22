import { Alert, Typography } from "@mui/material";

interface AvailabilityInfoNoteProps {
  weeksAhead: number;
}

export default function AvailabilityInfoNote({ weeksAhead }: AvailabilityInfoNoteProps) {
  return (
    <Alert severity="info" sx={{ mt: 2 }}>
      <Typography variant="body2">
        Si activás <strong>"Repetir horarios semanalmente"</strong>, el horario que configures en
        esta semana se va a repetir automáticamente durante las próximas {weeksAhead} semanas. Si en
        algún momento editás una semana puntual, esa semana queda protegida: los cambios que hagas
        después en tu horario habitual ya no la van a modificar. Podés usar el botón "Usar mi
        horario habitual en esta semana" para volver a esa semana a la normalidad.
      </Typography>
    </Alert>
  );
}
