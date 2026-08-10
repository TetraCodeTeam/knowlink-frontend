import { httpClient } from "@/shared/lib/http-client";
import type { MinNoticeMinutesResponse } from "@/modules/tutor/availability/interfaces/responses/min-notice.interface";
import type { UpdateMinNoticeRequest } from "@/modules/tutor/availability/interfaces/requests/update-min-notice.interface";

export async function getMinNoticeMinutes(): Promise<MinNoticeMinutesResponse> {
  const response = await httpClient.get<MinNoticeMinutesResponse>(
    "/api/v1/tutors/me/min-notice-minutes",
  );
  return response.data;
}

export async function updateMinNoticeMinutes(minutes: number | null): Promise<void> {
  const body: UpdateMinNoticeRequest = { minNoticeMinutes: minutes };
  await httpClient.put("/api/v1/tutors/me/min-notice-minutes", body);
}

