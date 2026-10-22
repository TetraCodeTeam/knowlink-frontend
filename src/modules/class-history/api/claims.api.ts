import { httpClient } from "@/shared/lib/httpClient";

export type ClaimReason =
  "STUDENT_COULD_NOT_ATTEND" | "TUTOR_COULD_NOT_ATTEND" | "I_COULD_NOT_ATTEND";

export interface ClaimEligibility {
  canClaim: boolean;
  claimableUntil: string | null;
  blockReason: string | null;
  allowedReasons: ClaimReason[];
}

export interface CreateClaimRequest {
  reason: ClaimReason;
  comment: string;
  files: File[];
}

export async function getClaimEligibility(bookingId: string): Promise<ClaimEligibility> {
  const response = await httpClient.get<ClaimEligibility>(
    `/api/v1/bookings/${bookingId}/claims/eligibility`
  );
  return response.data;
}

export async function createClaim(bookingId: string, request: CreateClaimRequest): Promise<void> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ reason: request.reason, comment: request.comment })], {
      type: "application/json",
    })
  );
  request.files.forEach((file) => formData.append("files", file));
  await httpClient.post(`/api/v1/bookings/${bookingId}/claims`, formData);
}
