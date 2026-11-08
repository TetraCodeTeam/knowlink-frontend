import { httpClient } from "@/shared/lib/httpClient";
import type { PendingRatingsResponse } from "@/modules/class-history/interfaces/responses/pending-ratings.interface";

export async function getPendingRatings(): Promise<PendingRatingsResponse> {
  const response = await httpClient.get<PendingRatingsResponse>("/api/v1/ratings/pending");
  return response.data;
}
