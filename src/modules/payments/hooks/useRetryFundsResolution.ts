import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { retryFundsResolution } from "@/modules/payments/api/funds.api";

export function useRetryFundsResolution(bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => retryFundsResolution(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["funds-transfer", bookingId] });
      toast.success("Liberación de fondos reintentada exitosamente.");
    },
    onError: () => {
      toast.error("No se pudo reintentar la liberación de fondos. Intentá nuevamente.");
    },
  });
}