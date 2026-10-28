import { httpClient } from "@/shared/lib/httpClient";
import type { TutorClaimDetail } from "@/modules/support/interfaces/responses/tutor-claim-detail.response";

export async function getTutorClaimDetail(claimId: string): Promise<TutorClaimDetail> {
  const response = await httpClient.get<TutorClaimDetail>(
    `/api/v1/tutors/support/session-claims/${claimId}`
  );
  return response.data;
}

export async function addTutorClaimComment(claimId: string, comment: string): Promise<void> {
  await httpClient.post(`/api/v1/tutors/support/session-claims/${claimId}/comments`, { comment });
}
