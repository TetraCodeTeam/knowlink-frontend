import { httpClient } from "@/shared/lib/httpClient";
import type { AvailabilityBlockRequest } from "@/modules/tutor/availability/interfaces/requests/availability-block.interface";
import type { AvailabilityBlockResponse } from "@/modules/tutor/availability/interfaces/responses/availability-block.interface";
import type { WeekCustomizationResponse } from "@/modules/tutor/availability/interfaces/responses/week-customization.interface";

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

export async function getWeekCustomization(weekStart: string): Promise<WeekCustomizationResponse> {
  const response = await httpClient.get<WeekCustomizationResponse>(
    "/api/v1/tutors/me/availability-blocks/customization",
    { params: { weekStart } },
  );
  return response.data;
}

export async function removeWeekCustomization(weekStart: string): Promise<void> {
  await httpClient.delete("/api/v1/tutors/me/availability-blocks/customization", {
    params: { weekStart },
  });
}