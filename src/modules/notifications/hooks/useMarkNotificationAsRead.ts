import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/modules/notifications/api/notifications.api";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";
import type { InfiniteData } from "@tanstack/react-query";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const role = useAuthStore((s) => s.authResponse?.role) ?? "ANONYMOUS";

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.listBase });
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCountBase });

      const previousLists = queryClient.getQueriesData<InfiniteData<PagedNotificationsResponse>>({
        queryKey: NOTIFICATION_QUERY_KEYS.listBase,
      });
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount(role)
      );

      queryClient.setQueriesData<InfiniteData<PagedNotificationsResponse>>(
        { queryKey: NOTIFICATION_QUERY_KEYS.listBase },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.notificationId === notificationId ? { ...item, read: true } : item
              ),
            })),
          };
        }
      );

      queryClient.setQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount(role),
        (old) => {
          if (!old) return old;
          return { count: Math.max(0, old.count - 1) };
        }
      );

      return { previousLists, previousUnreadCount };
    },
    onError: (_error, _notificationId, context) => {
      for (const [key, data] of context?.previousLists ?? []) {
        if (data) queryClient.setQueryData(key, data);
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.unreadCount(role),
          context.previousUnreadCount
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCountBase });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.listBase });
    },
  });
}
