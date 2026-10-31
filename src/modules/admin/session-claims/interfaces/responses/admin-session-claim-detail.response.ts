import type { AdminClaimParty } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-party.response";
import type { AdminSessionClaimListItem } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";

export interface AdminSessionClaimDetailResponse extends AdminSessionClaimListItem {
  /** Monto retenido de la sesión, en pesos. */
  heldAmount: number;
  tutor: AdminClaimParty;
  student: AdminClaimParty;
}
