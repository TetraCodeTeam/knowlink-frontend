import { rawHttpClient } from "@/shared/lib/httpClient";
import type { SupportUnreadCountResponse } from "@/modules/student/support/interfaces/responses/support-unread-count.response";

export async function getSupportUnreadCount(): Promise<SupportUnreadCountResponse> {
  const response = await rawHttpClient.get<SupportUnreadCountResponse>(
    "/api/v1/notifications/support/unread-count"
  );
  return response.data;
}
