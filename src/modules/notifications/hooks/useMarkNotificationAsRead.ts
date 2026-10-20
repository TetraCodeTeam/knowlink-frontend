import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/modules/notifications/api/notifications.api";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";
import type { InfiniteData } from "@tanstack/react-query";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list });
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });

      const previousList = queryClient.getQueryData<
        InfiniteData<PagedNotificationsResponse>
      >(NOTIFICATION_QUERY_KEYS.list);
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount,
      );

      queryClient.setQueryData<InfiniteData<PagedNotificationsResponse>>(
        NOTIFICATION_QUERY_KEYS.list,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.notificationId === notificationId ? { ...item, read: true } : item,
              ),
            })),
          };
        },
      );

      queryClient.setQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount,
        (old) => {
          if (!old) return old;
          return { count: Math.max(0, old.count - 1) };
        },
      );

      return { previousList, previousUnreadCount };
    },
    onError: (_error, _notificationId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.list, context.previousList);
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.unreadCount,
          context.previousUnreadCount,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list });
    },
  });
}
