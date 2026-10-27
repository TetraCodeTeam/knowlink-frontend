import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "@/modules/notifications/api/notifications.api";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import {
  NOTIFICATION_POLL_INTERVAL,
  NOTIFICATIONS_PAGE_SIZE,
} from "@/modules/notifications/constants/notification-polling";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { NotificationReadFilter } from "@/modules/notifications/types/notification-read-filter.type";

export function useNotifications(status: NotificationReadFilter, enabled: boolean) {
  const role = useAuthStore((s) => s.authResponse?.role) ?? "ANONYMOUS";

  return useInfiniteQuery({
    queryKey: [...NOTIFICATION_QUERY_KEYS.list(role), status],
    queryFn: ({ pageParam }) =>
      getNotifications({ page: pageParam, size: NOTIFICATIONS_PAGE_SIZE, status }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PagedNotificationsResponse) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    enabled,
    refetchInterval: enabled ? NOTIFICATION_POLL_INTERVAL : false,
  });
}
