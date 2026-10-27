import type { NotificationResponse } from "@/modules/notifications/interfaces/responses/notification.interface";

export interface NotificationItemProps {
  notification: NotificationResponse;
  onMarkAsRead: (notificationId: string) => void;
  onClose: () => void;
}
