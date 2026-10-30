import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { getSupportUnreadCount } from "@/modules/student/support/api/supportUnreadCount.api";

export const SUPPORT_UNREAD_COUNT_QUERY_KEY = ["studentSupport", "unread-count"] as const;

const SUPPORT_UNREAD_POLL_INTERVAL = 30_000;

export function useSupportUnreadCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: SUPPORT_UNREAD_COUNT_QUERY_KEY,
    queryFn: getSupportUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: SUPPORT_UNREAD_POLL_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
