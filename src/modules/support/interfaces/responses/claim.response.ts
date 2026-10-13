import type { ClaimStatus } from "@/modules/support/types/claim-status.type";

// Forma provisoria: confirmar contra el DTO real del backend antes de conectar.
export interface ClaimResponse {
  id: number;
  subjectName: string;
  studentName: string;
  sessionDate: string; // ISO yyyy-MM-dd
  reason: string;
  status: ClaimStatus;
  resolvedAt: string | null; // ISO yyyy-MM-dd, solo si status === "RESOLVED"
  hasUnseenUpdate: boolean;
}
