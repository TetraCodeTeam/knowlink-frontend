/**
 * Contrato de `GET /api/v1/admin/navigation/badges`.
 *
 * Los nombres coinciden con el backend, por eso no hace falta un mapper.
 */
export interface AdminNavigationBadgesResponse {
  pendingMaterialReports: number;
  pendingSessionClaims: number;
}
