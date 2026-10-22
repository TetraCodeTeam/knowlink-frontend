import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";

export interface ClaimResponse {
  id: string;
  subjectName: string;
  studentName: string;
  sessionDate: string; // ISO yyyy-MM-dd
  reason: string;
  status: ClaimStatus;
  resolvedAt: string | null; // ISO yyyy-MM-dd, solo si status === "RESOLVED"
  hasUnseenUpdate: boolean;
}
