import type { NotificationType } from "@/modules/notifications/types/notification-type.type";

export interface NotificationResponse {
  notificationId: string;
  type: NotificationType;
  message: string;
  referenceId: string | null;
  read: boolean;
  createdAt: string;
}
