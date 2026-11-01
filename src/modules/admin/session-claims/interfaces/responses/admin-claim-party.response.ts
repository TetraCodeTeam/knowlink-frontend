export type AdminClaimPartyRole = "TUTOR" | "STUDENT";

export interface AdminClaimParty {
  fullName: string;
  role: AdminClaimPartyRole;
  /** `null` cuando la parte no dejó un mensaje en el reclamo. */
  message: string | null;
}
