import type { AdminClaimContactInfoResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-contact-info.response";
import type { AdminSessionClaimDetailResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-detail.response";
import type { AdminSessionClaimListItem } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";
import type { AdminSessionClaimListResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list.response";
import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";

/**
 * Tipos del contrato real del backend (`docs/admin/admin-frontend-contract.md`).
 *
 * El backend envuelve la página en `page`, nombra al asignado como
 * `assignedAdmin.fullName` y devuelve el detalle como `{ summary, heldAmount,
 * automaticOutcome, tutor, student, permissions }`. El mapper lo adapta al
 * modelo de vista que ya consumen los componentes.
 */
export interface ApiAssignedAdmin {
  adminId: string;
  fullName: string;
}

export interface ApiSessionClaimListItem {
  claimId: string;
  subjectName: string;
  tutorName: string;
  studentName: string;
  sessionDate: string;
  status: ClaimStatus;
  openedAt: string;
  assignedAdmin: ApiAssignedAdmin | null;
  assignedToMe: boolean;
  resolvedAt: string | null;
  favoredParty: "STUDENT" | "TUTOR" | null;
  resolutionJustification: string | null;
}

export interface ApiPagedSessionClaims {
  content: ApiSessionClaimListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiSessionClaimListResponse {
  page: ApiPagedSessionClaims;
  statusCounts: AdminSessionClaimListResponse["statusCounts"];
}

export interface ApiClaimPartyStatement {
  fullName: string;
  reasonCode: string;
  reasonLabel: string;
  message: string | null;
}

export interface ApiSessionClaimDetailResponse {
  summary: ApiSessionClaimListItem;
  heldAmount: number;
  automaticOutcome: {
    code: string;
    label: string;
  } | null;
  tutor: ApiClaimPartyStatement;
  student: ApiClaimPartyStatement;
  permissions: {
    canTake: boolean;
    canViewContact: boolean;
    canResolve: boolean;
  };
}

export interface ApiPartyContact {
  fullName: string;
  email: string;
  phoneNumber: string;
  dni: string;
  institutionalId: string;
  career: string;
}

export interface ApiClaimContactInfoResponse {
  tutor: ApiPartyContact;
  student: ApiPartyContact;
}

export function mapSessionClaimItem(api: ApiSessionClaimListItem): AdminSessionClaimListItem {
  return {
    claimId: api.claimId,
    subjectName: api.subjectName,
    status: api.status,
    sessionDate: api.sessionDate,
    tutorName: api.tutorName,
    studentName: api.studentName,
    assignedToName: api.assignedAdmin?.fullName ?? null,
    assignedToMe: api.assignedToMe,
    resolutionJustification: api.resolutionJustification,
  };
}

export function mapSessionClaimList(
  api: ApiSessionClaimListResponse
): AdminSessionClaimListResponse {
  return {
    content: api.page.content.map(mapSessionClaimItem),
    page: api.page.page,
    size: api.page.size,
    totalElements: api.page.totalElements,
    statusCounts: api.statusCounts,
  };
}

export function mapSessionClaimDetail(
  api: ApiSessionClaimDetailResponse
): AdminSessionClaimDetailResponse {
  return {
    ...mapSessionClaimItem(api.summary),
    heldAmount: api.heldAmount,
    tutor: {
      fullName: api.tutor.fullName,
      role: "TUTOR",
      message: api.tutor.message,
    },
    student: {
      fullName: api.student.fullName,
      role: "STUDENT",
      message: api.student.message,
    },
  };
}

export function mapClaimContactInfo(
  api: ApiClaimContactInfoResponse
): AdminClaimContactInfoResponse {
  return {
    tutor: {
      fullName: api.tutor.fullName,
      phone: api.tutor.phoneNumber,
      email: api.tutor.email,
      institution: api.tutor.career,
      fileNumber: api.tutor.institutionalId,
    },
    student: {
      fullName: api.student.fullName,
      phone: api.student.phoneNumber,
      email: api.student.email,
      nationalId: api.student.dni,
    },
  };
}
