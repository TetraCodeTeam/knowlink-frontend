import { httpClient } from "@/shared/lib/httpClient";
import type { StudentSupportResponse } from "@/modules/student/support/interfaces/responses/student-support.response";

export async function getStudentSupport(): Promise<StudentSupportResponse> {
  const response = await httpClient.get<StudentSupportResponse>("/api/v1/students/support");
  return response.data;
}
