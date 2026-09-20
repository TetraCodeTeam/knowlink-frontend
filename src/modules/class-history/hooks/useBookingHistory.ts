import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookingHistory } from "@/modules/class-history/api/classHistory.api";
import { HISTORY_PAGE_SIZE } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";
import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

export function useBookingHistory(role: BookingRole, category: BookingHistoryCategory) {
  const [page, setPage] = useState(0);
  const [pagesContent, setPagesContent] = useState<Record<number, BookingHistoryItem[]>>({});

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["bookingHistory", role, category, page],
    queryFn: () => getBookingHistory({ role, category, page, size: HISTORY_PAGE_SIZE }),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!data) return;
    setPagesContent((prev) => ({ ...prev, [page]: data.content }));
  }, [data, page]);

  const items = useMemo(
    () =>
      Object.keys(pagesContent)
        .map(Number)
        .sort((a, b) => a - b)
        .flatMap((loadedPage) => pagesContent[loadedPage]),
    [pagesContent]
  );

  const resetPage = () => {
    setPage(0);
    setPagesContent({});
  };

  return {
    items,
    hasNext: data?.hasNext ?? false,
    page,
    goToNextPage: () => setPage((p) => p + 1),
    resetPage,
    isLoading,
    isFetching,
    isError,
  };
}
