import { httpClient } from "@/shared/lib/httpClient";
import { AvailabilityBlockRequest } from "../interfaces/requests/availability-block.interface";
import { AvailabilityBlockResponse } from "../interfaces/responses/availability-block.interface";


export async function getAvailabilityBlocksInRange(from: string, to: string): Promise<AvailabilityBlockResponse[]> {
  const response = await httpClient.get<AvailabilityBlockResponse[]>("/api/v1/tutors/me/availability-blocks", {
    params: { from, to },
  });
  return response.data;
}

export async function saveWeekAvailabilityBlocks(
  weekStart: string,
  weekEnd: string,
  blocks: AvailabilityBlockRequest[],
): Promise<AvailabilityBlockResponse[]> {
  const response = await httpClient.put<AvailabilityBlockResponse[]>(
    "/api/v1/tutors/me/availability-blocks",
    { blocks },
    { params: { weekStart, weekEnd } },
  );
  return response.data;
}