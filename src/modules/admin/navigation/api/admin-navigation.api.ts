import { rawHttpClient } from "@/shared/lib/httpClient";
import type { AdminNavigationBadgesResponse } from "@/modules/admin/navigation/interfaces/responses/admin-navigation-badges.response";

/**
 * Contadores de pendientes que se muestran como badge en el sidebar.
 *
 * Usa `rawHttpClient` porque el badge es información auxiliar: si falla, la navegación
 * sigue funcionando y no debe abrirse el snackbar global de errores.
 */
export async function getAdminNavigationBadges(): Promise<AdminNavigationBadgesResponse> {
  const { data } = await rawHttpClient.get<AdminNavigationBadgesResponse>(
    "/api/v1/admin/navigation/badges"
  );
  return data;
}
