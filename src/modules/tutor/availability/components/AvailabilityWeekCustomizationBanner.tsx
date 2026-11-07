import { Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import FrankieCallout from "@/shared/frankie/FrankieCallout";

interface AvailabilityWeekCustomizationBannerProps {
  onRestore: () => void;
  isPending: boolean;
}

export default function AvailabilityWeekCustomizationBanner({
  onRestore,
  isPending,
}: AvailabilityWeekCustomizationBannerProps) {
  return (
    <FrankieCallout kind="warning" sx={{ mt: 1.5 }}>
      <Typography fontSize={13} fontWeight={600}>
        Esta semana tiene un horario distinto a tu horario habitual.
      </Typography>
      <Typography fontSize={12.5} color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
        Podés quitar esta excepción. El cambio se va a reflejar la próxima vez que actualices tu
        horario habitual, no de inmediato.
      </Typography>
      <AppButton appVariant="outline" onClick={onRestore} loading={isPending} size="small">
        Quitar excepción
      </AppButton>
    </FrankieCallout>
  );
}
