import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rateBooking } from "@/modules/class-history/api/classHistory.api";
import type { RateBookingRequest } from "@/modules/class-history/interfaces/requests/rate-booking.interface";

export function useRateBooking(bookingId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["rateBooking", bookingId],
    mutationFn: (data: RateBookingRequest) => rateBooking(bookingId, data),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
  }, [queryClient, bookingId]);

  return {
    submitRating: mutation.mutateAsync,
    isPending: mutation.isPending,
    invalidate,
  };
}
