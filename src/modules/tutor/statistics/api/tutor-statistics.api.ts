import { httpClient } from "@/shared/lib/httpClient";
import type { TutorStatisticsParams } from "@/modules/tutor/statistics/interfaces/requests/tutor-statistics.request";
import type { TutorStatisticsResponse } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";

export async function getTutorStatistics(
  params: TutorStatisticsParams
): Promise<TutorStatisticsResponse> {
  const response = await httpClient.get<TutorStatisticsResponse>("/api/v1/tutors/statistics", {
    params,
  });
  return response.data;
}
