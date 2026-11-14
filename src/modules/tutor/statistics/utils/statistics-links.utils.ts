import { TUTOR_STATISTICS_PATHS } from "@/modules/tutor/statistics/constants/statistics.constants";

/**
 * Ruta de Soporte en la pestaña de reclamos. Con el id de un reclamo, Soporte abre directamente su
 * detalle (la pantalla lee `tab` y `claim` de la URL); sin él, muestra el listado.
 */
export function buildSupportClaimsPath(claimId?: string | null): string {
  const params = new URLSearchParams({ tab: "claims" });
  if (claimId) {
    params.set("claim", claimId);
  }
  return `${TUTOR_STATISTICS_PATHS.support}?${params.toString()}`;
}
