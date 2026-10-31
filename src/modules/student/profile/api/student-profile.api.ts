import { httpClient } from "@/shared/lib/httpClient";
import type { StudentSelfProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";
import type { UpdateStudentProfileRequest } from "@/modules/users/interfaces/requests/edit-profile.interface";

export async function getMyStudentProfile(): Promise<StudentSelfProfileResponse> {
  const response = await httpClient.get<StudentSelfProfileResponse>("/api/v1/students/me/profile");
  return response.data;
}

export async function updateMyStudentProfile(
  data: UpdateStudentProfileRequest
): Promise<StudentSelfProfileResponse> {
  const response = await httpClient.put<StudentSelfProfileResponse>(
    "/api/v1/students/me/profile",
    data
  );
  return response.data;
}
