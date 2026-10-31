import { describe, expect, it } from "vitest";
import {
  mapClaimContactInfo,
  mapSessionClaimDetail,
  mapSessionClaimList,
  type ApiClaimContactInfoResponse,
  type ApiSessionClaimDetailResponse,
  type ApiSessionClaimListResponse,
} from "@/modules/admin/session-claims/api/session-claim.mapper";

const LIST_ITEM = {
  claimId: "b143695c-24ad-4304-b513-ad9997fd1c61",
  subjectName: "Física",
  tutorName: "Julián López Salvucci",
  studentName: "Alumno Test",
  sessionDate: "2026-10-18",
  status: "OPEN" as const,
  openedAt: "2026-10-18T13:05:20.77717",
  assignedAdmin: null,
  assignedToMe: false,
  resolvedAt: null,
  favoredParty: null,
  resolutionJustification: null,
};

describe("session claim mapper", () => {
  it("desenvuelve la página y traduce assignedAdmin a assignedToName", () => {
    const api: ApiSessionClaimListResponse = {
      page: {
        content: [
          LIST_ITEM,
          {
            ...LIST_ITEM,
            claimId: "claim-2",
            status: "IN_REVIEW",
            assignedAdmin: { adminId: "admin-1", fullName: "Administrador Demo" },
            assignedToMe: true,
          },
        ],
        page: 0,
        size: 10,
        totalElements: 2,
        totalPages: 1,
        hasNext: false,
      },
      statusCounts: { open: 1, inReview: 1, resolved: 0 },
    };

    const mapped = mapSessionClaimList(api);

    expect(mapped.totalElements).toBe(2);
    expect(mapped.statusCounts).toEqual({ open: 1, inReview: 1, resolved: 0 });
    expect(mapped.content[0]).toMatchObject({
      claimId: LIST_ITEM.claimId,
      assignedToName: null,
      assignedToMe: false,
    });
    expect(mapped.content[1]).toMatchObject({
      assignedToName: "Administrador Demo",
      assignedToMe: true,
    });
    expect(mapped.content[0]).not.toHaveProperty("openedAt");
  });

  it("compone el detalle desde summary y agrega el rol de cada parte", () => {
    const api: ApiSessionClaimDetailResponse = {
      summary: LIST_ITEM,
      heldAmount: 12500.5,
      automaticOutcome: {
        code: "SESSION_NOT_HELD_REFUND_TO_STUDENT",
        label: "Sesión no realizada",
      },
      tutor: {
        fullName: "Julián López Salvucci",
        reasonCode: "TUTOR_COULD_NOT_ATTEND",
        reasonLabel: "El tutor no pudo asistir",
        message: "No pude conectarme.",
      },
      student: {
        fullName: "Alumno Test",
        reasonCode: "TUTOR_COULD_NOT_ATTEND",
        reasonLabel: "El tutor no pudo asistir",
        message: null,
      },
      permissions: { canTake: true, canViewContact: false, canResolve: false },
    };

    const mapped = mapSessionClaimDetail(api);

    expect(mapped).toMatchObject({
      claimId: LIST_ITEM.claimId,
      heldAmount: 12500.5,
      tutor: { fullName: "Julián López Salvucci", role: "TUTOR", message: "No pude conectarme." },
      student: { fullName: "Alumno Test", role: "STUDENT", message: null },
    });
  });

  it("traduce los campos de contacto del backend", () => {
    const api: ApiClaimContactInfoResponse = {
      tutor: {
        fullName: "Julián López Salvucci",
        email: "julian@knowlink.test",
        phoneNumber: "+54 11 5555-1234",
        dni: "30111222",
        institutionalId: "LEG-2001",
        career: "Licenciatura en Física",
      },
      student: {
        fullName: "Alumno Test",
        email: "alumno@knowlink.test",
        phoneNumber: "+54 11 4444-5678",
        dni: "38123456",
        institutionalId: "ALU-9001",
        career: "Licenciatura en Física",
      },
    };

    expect(mapClaimContactInfo(api)).toEqual({
      tutor: {
        fullName: "Julián López Salvucci",
        phone: "+54 11 5555-1234",
        email: "julian@knowlink.test",
        institution: "Licenciatura en Física",
        fileNumber: "LEG-2001",
      },
      student: {
        fullName: "Alumno Test",
        phone: "+54 11 4444-5678",
        email: "alumno@knowlink.test",
        nationalId: "38123456",
      },
    });
  });
});
