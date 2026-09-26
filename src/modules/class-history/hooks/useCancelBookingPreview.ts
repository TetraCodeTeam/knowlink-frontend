import { useQuery } from "@tanstack/react-query";
import { getCancellationPreview } from "@/modules/class-history/api/classHistory.api";

export function useCancelBookingPreview(bookingId: string, enabled: boolean) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cancellationPreview", bookingId],
    queryFn: () => getCancellationPreview(bookingId),
    enabled,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    preview: data,
    isLoading,
    isError,
  };
}
