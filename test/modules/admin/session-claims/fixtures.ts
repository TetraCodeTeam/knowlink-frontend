import type { AdminClaimContactInfoResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-contact-info.response";
import type { AdminSessionClaimDetailResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-detail.response";
import type { AdminSessionClaimListItem } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";
import type { AdminSessionClaimListResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list.response";

export function makeSessionClaimListItem(
  overrides: Partial<AdminSessionClaimListItem> = {}
): AdminSessionClaimListItem {
  return {
    claimId: "claim-1",
    subjectName: "Análisis Matemático",
    status: "OPEN",
    sessionDate: "2026-07-22",
    tutorName: "Silvina Rubio",
    studentName: "Bruno Peralta",
    assignedToName: null,
    assignedToMe: false,
    resolutionJustification: null,
    ...overrides,
  };
}

export function makeSessionClaimDetail(
  overrides: Partial<AdminSessionClaimDetailResponse> = {}
): AdminSessionClaimDetailResponse {
  return {
    ...makeSessionClaimListItem(),
    heldAmount: 8000,
    tutor: {
      fullName: "Silvina Rubio",
      role: "TUTOR",
      message: "Esperé conectada 20 minutos y el alumno nunca ingresó a la videollamada.",
    },
    student: {
      fullName: "Bruno Peralta",
      role: "STUDENT",
      message: "Tuve un problema con el transporte y no pude avisar a tiempo.",
    },
    ...overrides,
  };
}

export function makeSessionClaimListResponse(
  overrides: Partial<AdminSessionClaimListResponse> = {}
): AdminSessionClaimListResponse {
  return {
    content: [makeSessionClaimListItem()],
    page: 0,
    size: 4,
    totalElements: 1,
    statusCounts: { open: 5, inReview: 4, resolved: 5 },
    ...overrides,
  };
}

export function makeContactInfo(
  overrides: Partial<AdminClaimContactInfoResponse> = {}
): AdminClaimContactInfoResponse {
  return {
    tutor: {
      fullName: "Silvina Rubio",
      phone: "+54 11 5555-1001",
      email: "silvina.rubio@knowlink.edu.ar",
      institution: "Universidad de Buenos Aires",
      fileNumber: "LEG-2001",
    },
    student: {
      fullName: "Bruno Peralta",
      phone: "+54 11 4444-1001",
      email: "bruno.peralta@knowlink.edu.ar",
      nationalId: "38.101.401",
    },
    ...overrides,
  };
}