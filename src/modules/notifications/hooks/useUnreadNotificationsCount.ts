import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "@/modules/notifications/api/notifications.api";
import { NOTIFICATION_QUERY_KEYS } from "@/modules/notifications/constants/notification-query-keys";
import { NOTIFICATION_POLL_INTERVAL } from "@/modules/notifications/constants/notification-polling";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

export function useUnreadNotificationsCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadCount,
    select: (data) => data.count,
    enabled: isAuthenticated,
    refetchInterval: NOTIFICATION_POLL_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
