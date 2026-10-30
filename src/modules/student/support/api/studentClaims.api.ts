import { httpClient } from "@/shared/lib/httpClient";
import type { StudentSessionClaimDetail } from "@/modules/student/support/interfaces/responses/student-claim-detail.response";
import type { ClaimComment } from "@/modules/student/support/interfaces/responses/student-claim-detail.response";

export async function getStudentClaimDetail(claimId: string): Promise<StudentSessionClaimDetail> {
  const response = await httpClient.get<StudentSessionClaimDetail>(
    `/api/v1/students/support/session-claims/${claimId}`
  );
  return response.data;
}

export async function addStudentClaimComment(
  claimId: string,
  comment: string
): Promise<ClaimComment> {
  const response = await httpClient.post<ClaimComment>(
    `/api/v1/students/support/session-claims/${claimId}/comments`,
    { comment }
  );
  return response.data;
}
