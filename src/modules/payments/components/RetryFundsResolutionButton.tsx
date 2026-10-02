import AppButton from "@/shared/components/AppButton";
import { useRetryFundsResolution } from "@/modules/payments/hooks/useRetryFundsResolution";
import type { RetryFundsResolutionButtonProps } from "./RetryFundsResolutionButton.types";

export default function RetryFundsResolutionButton({ bookingId }: RetryFundsResolutionButtonProps) {
  const { mutate, isPending } = useRetryFundsResolution(bookingId);

  return (
    <AppButton
      appVariant="outline"
      loading={isPending}
      disabled={isPending}
      onClick={() => mutate()}
    >
      Reintentar liberación de fondos
    </AppButton>
  );
}