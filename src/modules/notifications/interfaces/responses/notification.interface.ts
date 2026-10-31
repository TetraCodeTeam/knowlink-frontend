import type { NotificationActionStatus } from "@/modules/notifications/types/notification-action-status.type";
import type { NotificationType } from "@/modules/notifications/types/notification-type.type";

export interface NotificationResponse {
  notificationId: string;
  type: NotificationType;
  title: string | null;
  message: string;
  referenceId: string | null;
  read: boolean;
  createdAt: string;
  expiresAt: string | null;
  actionStatus: NotificationActionStatus;
}
