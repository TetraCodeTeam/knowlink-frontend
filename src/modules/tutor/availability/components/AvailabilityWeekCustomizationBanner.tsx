import { Alert, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";

interface AvailabilityWeekCustomizationBannerProps {
  onRestore: () => void;
  isPending: boolean;
}

export default function AvailabilityWeekCustomizationBanner({
  onRestore,
  isPending,
}: AvailabilityWeekCustomizationBannerProps) {
  return (
    <Alert severity="warning" sx={{ mt: 2 }}>
      <Typography variant="body2" fontWeight={600}>
        Esta semana tiene un horario distinto a tu horario habitual.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
        Podés quitar esta excepción. El cambio se va a reflejar la próxima vez que actualices tu
        horario habitual, no de inmediato.
      </Typography>
      <AppButton appVariant="outline" onClick={onRestore} loading={isPending} size="small">
        Quitar excepción
      </AppButton>
    </Alert>
  );
}
