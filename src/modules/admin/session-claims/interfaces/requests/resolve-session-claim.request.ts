import type { ClaimFavoredParty } from "@/modules/admin/types/claim-favored-party.type";

export interface ResolveSessionClaimRequest {
  favoredParty: ClaimFavoredParty;
  justification: string;
}
