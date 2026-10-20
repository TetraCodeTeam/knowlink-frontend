import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "@/modules/notifications/api/notifications.api";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import {
  NOTIFICATION_POLL_INTERVAL,
  NOTIFICATIONS_PAGE_SIZE,
} from "@/modules/notifications/constants/notification-polling";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";

export function useNotifications(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list,
    queryFn: ({ pageParam }) =>
      getNotifications({ page: pageParam, size: NOTIFICATIONS_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PagedNotificationsResponse) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    enabled,
    refetchInterval: enabled ? NOTIFICATION_POLL_INTERVAL : false,
  });
}
