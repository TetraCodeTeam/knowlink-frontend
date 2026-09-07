import { httpClient } from "@/shared/lib/httpClient";
import type { StudentSelfProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";

export async function getMyStudentProfile(): Promise<StudentSelfProfileResponse> {
  const response = await httpClient.get<StudentSelfProfileResponse>("/api/v1/students/me/profile");
  return response.data;
}

export async function uploadStudentProfilePicture(file: File): Promise<StudentSelfProfileResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await httpClient.post<StudentSelfProfileResponse>(
    "/api/v1/students/me/profile-picture",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
}