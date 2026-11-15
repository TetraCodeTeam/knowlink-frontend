import type { ClaimResolution } from "@/modules/support/interfaces/responses/claim-resolution.response";
import type { TutorClaimDetail } from "@/modules/support/interfaces/responses/tutor-claim-detail.response";
import type { StudentSessionClaimDetail } from "@/modules/student/support/interfaces/responses/student-claim-detail.response";

export function makeClaimResolution(overrides: Partial<ClaimResolution> = {}): ClaimResolution {
  return {
    favoredParty: "TUTOR",
    inMyFavor: true,
    justification: "Se verificó la evidencia y el reclamo procede.",
    resolvedAt: "2026-11-10T15:30:00",
    ...overrides,
  };
}

export function makeTutorClaimDetail(overrides: Partial<TutorClaimDetail> = {}): TutorClaimDetail {
  return {
    claimId: "claim-1",
    bookingId: "booking-1",
    student: {
      fullName: "Bruno Peralta",
      profilePictureUrl: null,
      careerName: "Lic. en Sistemas",
    },
    subjectName: "Análisis Matemático",
    careerName: "Lic. en Sistemas",
    sessionDate: "2026-07-22",
    sessionStartTime: "10:00",
    sessionEndTime: "11:00",
    reason: "STUDENT_COULD_NOT_ATTEND",
    status: "OPEN",
    claimantRole: "STUDENT",
    claimantName: "Bruno Peralta",
    declaration: "No pude asistir a la sesión.",
    createdAt: "2026-07-22T10:00:00",
    updatedAt: "2026-07-22T10:00:00",
    funds: {
      originalAmount: 8000,
      protectedAmount: 8000,
      status: "SUSPENDED_BY_CLAIM",
      currency: "ARS",
    },
    reviewProgress: {
      currentPhase: "MEDIATOR_ASSIGNMENT_QUEUED",
      queuePosition: 3,
      queueTotal: 5,
      responseDueAt: null,
      remainingMinutes: 90,
    },
    attachments: [],
    comments: [],
    resolution: null,
    ...overrides,
  };
}

export function makeStudentClaimDetail(
  overrides: Partial<StudentSessionClaimDetail> = {}
): StudentSessionClaimDetail {
  return {
    claimId: "claim-1",
    bookingId: "booking-1",
    tutor: { fullName: "Silvina Rubio", profilePictureUrl: null },
    subjectName: "Análisis Matemático",
    careerName: "Lic. en Sistemas",
    sessionDate: "2026-07-22",
    sessionStartTime: "10:00",
    sessionEndTime: "11:00",
    reason: "TUTOR_COULD_NOT_ATTEND",
    reasonLabel: "El tutor no pudo asistir",
    status: "OPEN",
    statusLabel: "En revisión",
    claimantRole: "STUDENT",
    initiatedByMe: true,
    claimantName: "Bruno Peralta",
    declaration: "El tutor no se conectó a la sesión.",
    createdAt: "2026-07-22T10:00:00",
    updatedAt: "2026-07-22T10:00:00",
    funds: {
      originalAmount: 8000,
      protectedAmount: 8000,
      protectedPercentage: 100,
      status: "SUSPENDED_BY_CLAIM",
      retained: true,
      currency: "ARS",
    },
    reviewProgress: {
      currentPhase: "MEDIATOR_ASSIGNMENT_QUEUED",
      queuePosition: 3,
      queueTotal: 5,
      responseDueAt: null,
      remainingMinutes: 90,
    },
    attachments: [],
    comments: [],
    resolution: null,
    ...overrides,
  };
}
