import type { NotificationReadFilter } from "@/modules/notifications/types/notification-read-filter.type";

export interface NotificationsListProps {
  status: NotificationReadFilter;
  onClose: () => void;
}
