import { useQuery } from "@tanstack/react-query";
import { getBookingDetail } from "@/modules/class-history/api/classHistory.api";

export function useBookingDetail(bookingId: string, enabled: boolean) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["bookingDetail", bookingId],
        queryFn: () => getBookingDetail(bookingId),
        enabled,
        staleTime: 1000 * 30,
    });

    return { detail: data, isLoading, isError };
}