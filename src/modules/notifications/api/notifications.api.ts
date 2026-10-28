import { httpClient, rawHttpClient } from "@/shared/lib/httpClient";
import type { PagedNotificationsResponse } from "@/modules/notifications/interfaces/responses/paged-notifications.interface";
import type { UnreadCountResponse } from "@/modules/notifications/interfaces/responses/unread-count.interface";
import type { NotificationReadFilter } from "@/modules/notifications/types/notification-read-filter.type";

export async function getNotifications(params: {
  page: number;
  size: number;
  status: NotificationReadFilter;
}): Promise<PagedNotificationsResponse> {
  const response = await httpClient.get<PagedNotificationsResponse>("/api/v1/notifications", {
    params,
  });
  return response.data;
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await rawHttpClient.get<UnreadCountResponse>(
    "/api/v1/notifications/unread-count"
  );
  return response.data;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await rawHttpClient.patch(`/api/v1/notifications/${notificationId}/read`);
}
