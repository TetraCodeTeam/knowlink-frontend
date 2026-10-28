import { httpClient } from "@/shared/lib/httpClient";
import type { StudentSelfProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";

export async function getMyStudentProfile(): Promise<StudentSelfProfileResponse> {
  const response = await httpClient.get<StudentSelfProfileResponse>("/api/v1/students/me/profile");
  return response.data;
}