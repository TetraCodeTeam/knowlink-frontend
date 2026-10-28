import type { NotificationResponse } from "@/modules/notifications/interfaces/responses/notification.interface";

export interface PagedNotificationsResponse {
  content: NotificationResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
