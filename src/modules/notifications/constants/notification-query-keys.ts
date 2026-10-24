export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  listBase: ["notifications", "list"] as const,
  list: (role: string) => ["notifications", "list", role],
  unreadCountBase: ["notifications", "unread-count"] as const,
  unreadCount: (role: string) => ["notifications", "unread-count", role],
};
