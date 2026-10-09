import { rawHttpClient } from "@/shared/lib/httpClient";
import type { ActivateTutorRoleRequest, ActivateTutorRoleResponse } from "@/modules/student/dual-role/interfaces/studentDualRole.interface";

export async function activateTutorRole(
  data: ActivateTutorRoleRequest
): Promise<ActivateTutorRoleResponse> {
  const response = await rawHttpClient.post<ActivateTutorRoleResponse>(
    "/api/v1/students/me/activate-tutor-role",
    data
  );
  return response.data;
}

export async function switchToTutorRole(): Promise<ActivateTutorRoleResponse> {
  const response = await rawHttpClient.post<ActivateTutorRoleResponse>(
    "/api/v1/students/me/activate-tutor-role",
    {}
  );
  return response.data;
}
