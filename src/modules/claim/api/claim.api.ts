import { httpClient } from "@/shared/lib/httpClient";
import type { ClaimEligibility } from "@/modules/claim/interfaces/responses/claim-eligibility.interface";
import type { ClaimResponse } from "@/modules/claim/interfaces/responses/claim-response.interface";
import type { CreateClaimRequest } from "@/modules/claim/interfaces/requests/create-claim.interface";

export async function getClaimEligibility(bookingId: string): Promise<ClaimEligibility> {
  const response = await httpClient.get<Partial<ClaimEligibility>>(
    `/api/v1/bookings/${bookingId}/claims/eligibility`
  );
  const data = response.data;
  return {
    canClaim: data.canClaim ?? false,
    claimableUntil: data.claimableUntil ?? null,
    blockReason: data.blockReason ?? null,
    allowedReasons: data.allowedReasons,
  };
}

export async function createClaim(
  bookingId: string,
  request: CreateClaimRequest,
  files: File[] = []
): Promise<ClaimResponse> {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  files.forEach((file) => formData.append("files", file));

  const response = await httpClient.post<ClaimResponse>(
    `/api/v1/bookings/${bookingId}/claims`,
    formData
  );
  return response.data;
}
