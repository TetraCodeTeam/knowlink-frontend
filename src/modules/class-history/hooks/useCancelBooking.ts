import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "@/modules/class-history/api/classHistory.api";

export function useCancelBooking(bookingId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["cancelBooking", bookingId],
    mutationFn: () => cancelBooking(bookingId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
    // The cancelled booking's slot becomes available again, so any cached
    // availability/booking-calendar views must be refetched to reflect it.
    queryClient.invalidateQueries({ queryKey: ["availability-blocks"] });
    queryClient.invalidateQueries({ queryKey: ["booking-calendar"] });
  };

  return {
    confirmCancelBooking: mutation.mutateAsync,
    cancellationResult: mutation.data,
    isPending: mutation.isPending,
    invalidate,
  };
}
