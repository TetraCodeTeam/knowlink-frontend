import { useQuery } from "@tanstack/react-query";
import { getFundsTransfer } from "@/modules/payments/api/funds.api";

export function useFundsTransfer(bookingId: string) {
  return useQuery({
    queryKey: ["funds-transfer", bookingId],
    queryFn: () => getFundsTransfer(bookingId),
    enabled: Boolean(bookingId),
  });
}