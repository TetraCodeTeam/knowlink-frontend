export type ClaimFavoredParty = "TUTOR" | "STUDENT";

export interface ClaimResolution {
  favoredParty: ClaimFavoredParty;
  inMyFavor: boolean;
  justification: string;
  resolvedAt: string; // ISO
}
