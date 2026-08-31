import { rawHttpClient } from "@/shared/lib/httpClient";
import type { ActivateStudentRoleResponse } from "@/modules/tutor/dual-role/interfaces/tutorDualRole.interface";

export async function activateStudentRole(): Promise<ActivateStudentRoleResponse> {
  const response = await rawHttpClient.post<ActivateStudentRoleResponse>(
    "/api/v1/tutors/me/activate-student-role",
    {}
  );
  return response.data;
}
