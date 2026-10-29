import { rawHttpClient } from "@/shared/lib/httpClient";
import type { AdminClaimContactInfoResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-contact-info.response";
import type { AdminSessionClaimDetailResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-detail.response";
import type { AdminSessionClaimListResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list.response";
import type { AdminSessionClaimListParams } from "@/modules/admin/session-claims/interfaces/requests/admin-session-claim-list.params";
import type { ResolveSessionClaimRequest } from "@/modules/admin/session-claims/interfaces/requests/resolve-session-claim.request";
import {
  assignMockSessionClaim,
  getMockClaimContactInfo,
  getMockSessionClaimDetail,
  listMockSessionClaims,
  resolveMockSessionClaim,
} from "@/modules/admin/session-claims/mocks/session-claims.mock";

const BASE_PATH = "/api/v1/admin/session-claims";

/**
 * El backend de reclamos de sesión todavía no existe. Los mocks están activos por
 * defecto y se pueden apagar con `VITE_ADMIN_SESSION_CLAIMS_MOCKS=false` para usar
 * el contrato real cuando esté disponible.
 */
const USE_MOCKS = import.meta.env.VITE_ADMIN_SESSION_CLAIMS_MOCKS !== "false";

/**
 * Usa `rawHttpClient` para que la pantalla controle el estado de error y los
 * diálogos muestren el `message` del backend sin duplicar el snackbar global.
 */
export async function getSessionClaims(
  filters: AdminSessionClaimListParams
): Promise<AdminSessionClaimListResponse> {
  if (USE_MOCKS) return listMockSessionClaims(filters);

  const params: Record<string, string | number | boolean> = {
    page: filters.page - 1,
    size: filters.size,
  };

  if (filters.status !== "ALL") params.status = filters.status;
  if (filters.scope === "mine") params.assignedToMe = true;

  const { data } = await rawHttpClient.get<AdminSessionClaimListResponse>(BASE_PATH, { params });
  return data;
}

export async function getSessionClaimDetail(
  claimId: string
): Promise<AdminSessionClaimDetailResponse> {
  if (USE_MOCKS) return getMockSessionClaimDetail(claimId);

  const { data } = await rawHttpClient.get<AdminSessionClaimDetailResponse>(
    `${BASE_PATH}/${claimId}`
  );
  return data;
}

export async function assignSessionClaim(claimId: string): Promise<void> {
  if (USE_MOCKS) return assignMockSessionClaim(claimId);

  await rawHttpClient.post(`${BASE_PATH}/${claimId}/assign`);
}

export async function getSessionClaimContactInfo(
  claimId: string
): Promise<AdminClaimContactInfoResponse> {
  if (USE_MOCKS) return getMockClaimContactInfo(claimId);

  const { data } = await rawHttpClient.get<AdminClaimContactInfoResponse>(
    `${BASE_PATH}/${claimId}/contact-info`
  );
  return data;
}

export async function resolveSessionClaim(
  claimId: string,
  payload: ResolveSessionClaimRequest
): Promise<void> {
  if (USE_MOCKS) return resolveMockSessionClaim(claimId, payload);

  await rawHttpClient.post(`${BASE_PATH}/${claimId}/resolve`, payload);
}
