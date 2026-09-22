import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookingHistory } from "@/modules/class-history/api/classHistory.api";
import { HISTORY_PAGE_SIZE } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

export function useBookingHistory(role: BookingRole, category: BookingHistoryCategory) {
  const { data, isLoading, isFetchingNextPage, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["bookingHistory", role, category],
      queryFn: ({ pageParam }) =>
        getBookingHistory({ role, category, page: pageParam, size: HISTORY_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
      staleTime: 1000 * 60,
    });

  const items = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data]);

  return {
    items,
    hasNext: hasNextPage,
    goToNextPage: fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
  };
}
