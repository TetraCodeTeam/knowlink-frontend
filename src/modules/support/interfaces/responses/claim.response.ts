import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";
import type { Role } from "@/shared/types/role.type";

export interface ClaimResponse {
  id: string;
  subjectName: string;
  studentName: string;
  sessionDate: string; // ISO yyyy-MM-dd
  reason: string;
  // Tutor y alumno pueden reclamar la misma sesión: cada reclamo indica quién lo inició.
  claimantRole: Role;
  status: ClaimStatus;
  resolvedAt: string | null; // ISO yyyy-MM-dd, solo si status === "RESOLVED"
  hasUnseenUpdate: boolean;
}
