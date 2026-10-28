import { useCallback } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";

export function useResolveRatingNotification() {
  const queryClient = useQueryClient();
  const role = useAuthStore((s) => s.authResponse?.role) ?? "ANONYMOUS";

  const resolve = useCallback(
    (bookingId: string) => {
      const lists = queryClient.getQueriesData<InfiniteData<PagedNotificationsResponse>>({
        queryKey: NOTIFICATION_QUERY_KEYS.listBase,
      });

      let wasUnread = false;

      for (const [queryKey, data] of lists) {
        if (!data) continue;

        let changed = false;
        const pages = data.pages.map((page) => ({
          ...page,
          content: page.content.map((notification) => {
            const isRatingNotification =
              notification.type === "RATING_ENABLED" && notification.referenceId === bookingId;

            if (!isRatingNotification) return notification;
            if (!notification.read) wasUnread = true;

            if (notification.read && notification.actionStatus === "COMPLETED") {
              return notification;
            }

            changed = true;
            return { ...notification, read: true, actionStatus: "COMPLETED" as const };
          }),
        }));

        if (changed) {
          queryClient.setQueryData(queryKey, { ...data, pages });
        }
      }

      if (wasUnread) {
        queryClient.setQueryData<UnreadCountResponse>(
          NOTIFICATION_QUERY_KEYS.unreadCount(role),
          (old) => (old ? { ...old, count: Math.max(0, old.count - 1) } : old)
        );
      }
    },
    [queryClient, role]
  );

  return { resolve };
}
