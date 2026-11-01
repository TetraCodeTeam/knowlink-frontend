import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";

export interface AdminSessionClaimListItem {
  claimId: string;
  subjectName: string;
  status: ClaimStatus;
  /** Fecha de la sesión en formato ISO `yyyy-MM-dd`. */
  sessionDate: string;
  tutorName: string;
  studentName: string;
  assignedToName: string | null;
  assignedToMe: boolean;
  resolutionJustification: string | null;
}
