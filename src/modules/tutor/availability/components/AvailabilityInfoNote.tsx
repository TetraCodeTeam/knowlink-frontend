import { Typography } from "@mui/material";
import FrankieCallout from "@/shared/frankie/FrankieCallout";

interface AvailabilityInfoNoteProps {
  weeksAhead: number;
}

export default function AvailabilityInfoNote({ weeksAhead }: AvailabilityInfoNoteProps) {
  return (
    <FrankieCallout kind="info" sx={{ mt: 1.5 }}>
      <Typography fontSize={13} lineHeight={1.5}>
        Si activás <strong>&quot;Repetir horarios semanalmente&quot;</strong>, el horario que
        configures en esta semana se va a repetir automáticamente durante las próximas {weeksAhead}{" "}
        semanas. Si en algún momento editás una semana puntual, esa semana queda protegida: los
        cambios que hagas después en tu horario habitual ya no la van a modificar. Podés usar el
        botón &quot;Usar mi horario habitual en esta semana&quot; para volver a esa semana a la
        normalidad.
      </Typography>
    </FrankieCallout>
  );
}
