import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookingHistory } from "@/modules/class-history/api/classHistory.api";
import { HISTORY_PAGE_SIZE } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

export function useBookingHistory(role: BookingRole, category: BookingHistoryCategory) {
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["bookingHistory", role, category, page],
    queryFn: () => getBookingHistory({ role, category, page, size: HISTORY_PAGE_SIZE }),
    staleTime: 1000 * 60,
  });

  return {
    items: data?.content ?? [],
    hasNext: data?.hasNext ?? false,
    page,
    goToNextPage: () => setPage((p) => p + 1),
    resetPage: () => setPage(0),
    isLoading,
    isFetching,
  };
}
