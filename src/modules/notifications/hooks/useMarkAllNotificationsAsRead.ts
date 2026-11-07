import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "@/modules/notifications/api/notifications.api";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import { SUPPORT_UNREAD_COUNT_QUERY_KEY } from "@/modules/student/support/hooks/useSupportUnreadCount";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";
import type { InfiniteData } from "@tanstack/react-query";

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const role = useAuthStore((s) => s.authResponse?.role) ?? "ANONYMOUS";

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
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
              content: page.content.map((item) => ({ ...item, read: true })),
            })),
          };
        }
      );

      queryClient.setQueryData<UnreadCountResponse>(
        NOTIFICATION_QUERY_KEYS.unreadCount(role),
        (old) => {
          if (!old) return old;
          return { ...old, count: 0 };
        }
      );

      return { previousLists, previousUnreadCount };
    },
    onError: (_error, _variables, context) => {
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
      queryClient.invalidateQueries({ queryKey: SUPPORT_UNREAD_COUNT_QUERY_KEY });
    },
  });
}
