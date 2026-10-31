import type { AdminClaimContactInfoResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-contact-info.response";
import type { AdminClaimParty } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-party.response";
import type { AdminSessionClaimDetailResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-detail.response";
import type { AdminSessionClaimListItem } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";
import type { AdminSessionClaimListResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list.response";
import type { AdminSessionClaimListParams } from "@/modules/admin/session-claims/interfaces/requests/admin-session-claim-list.params";
import type { ResolveSessionClaimRequest } from "@/modules/admin/session-claims/interfaces/requests/resolve-session-claim.request";

/**
 * Backend simulado de reclamos de sesión.
 *
 * El contrato todavía no existe en el backend. Mientras `VITE_ADMIN_SESSION_CLAIMS_MOCKS`
 * no sea "false", la capa `api/` resuelve contra este store en memoria: los filtros,
 * la paginación, la toma de solicitud, el contacto y la resolución funcionan de punta
 * a punta y sobreviven mientras la pestaña siga abierta.
 */

export const MOCK_CURRENT_ADMIN_NAME = "Moderador Carlos V.";

const MOCK_LATENCY_MS = 250;

const TUTOR = "TUTOR" as const;
const STUDENT = "STUDENT" as const;

function party(
  fullName: string,
  role: AdminClaimParty["role"],
  message: string | null
): AdminClaimParty {
  return { fullName, role, message };
}

const SEED_CLAIMS: AdminSessionClaimDetailResponse[] = [
  {
    claimId: "claim-1",
    subjectName: "Análisis Matemático",
    status: "OPEN",
    sessionDate: "2026-07-22",
    tutorName: "Silvina Rubio",
    studentName: "Bruno Peralta",
    assignedToName: null,
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 8000,
    tutor: party(
      "Silvina Rubio",
      TUTOR,
      "Esperé conectada 20 minutos y el alumno nunca ingresó a la videollamada."
    ),
    student: party(
      "Bruno Peralta",
      STUDENT,
      "Tuve un problema con el transporte y no pude avisar a tiempo."
    ),
  },
  {
    claimId: "claim-2",
    subjectName: "Álgebra Lineal",
    status: "OPEN",
    sessionDate: "2026-07-24",
    tutorName: "Martín Gómez",
    studentName: "Lucía Fernández",
    assignedToName: null,
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 6500,
    tutor: party(
      "Martín Gómez",
      TUTOR,
      "El alumno ingresó 25 minutos tarde y la sesión ya había finalizado."
    ),
    student: party("Lucía Fernández", STUDENT, null),
  },
  {
    claimId: "claim-3",
    subjectName: "Física I",
    status: "OPEN",
    sessionDate: "2026-07-27",
    tutorName: "Carla Domínguez",
    studentName: "Nicolás Sosa",
    assignedToName: null,
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 9000,
    tutor: party("Carla Domínguez", TUTOR, "Hubo problemas de conexión durante toda la clase."),
    student: party(
      "Nicolás Sosa",
      STUDENT,
      "La conexión falló de mi lado, pero pudimos continuar por chat."
    ),
  },
  {
    claimId: "claim-4",
    subjectName: "Química Orgánica",
    status: "OPEN",
    sessionDate: "2026-07-29",
    tutorName: "Pablo Herrera",
    studentName: "Julieta Acosta",
    assignedToName: null,
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 7200,
    tutor: party("Pablo Herrera", TUTOR, null),
    student: party(
      "Julieta Acosta",
      STUDENT,
      "El tutor no respondió los mensajes previos a la sesión."
    ),
  },
  {
    claimId: "claim-5",
    subjectName: "Historia Argentina",
    status: "OPEN",
    sessionDate: "2026-08-01",
    tutorName: "Ana María López",
    studentName: "Tomás Vidal",
    assignedToName: null,
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 5000,
    tutor: party(
      "Ana María López",
      TUTOR,
      "La clase se dictó completa y el alumno solicita el reintegro sin justificar."
    ),
    student: party(
      "Tomás Vidal",
      STUDENT,
      "El audio del tutor no funcionaba y no pude seguir la explicación."
    ),
  },
  {
    claimId: "claim-6",
    subjectName: "Programación I",
    status: "IN_REVIEW",
    sessionDate: "2026-08-03",
    tutorName: "Diego Álvarez",
    studentName: "Sofía Ramírez",
    assignedToName: MOCK_CURRENT_ADMIN_NAME,
    assignedToMe: true,
    resolutionJustification: null,
    heldAmount: 11000,
    tutor: party(
      "Diego Álvarez",
      TUTOR,
      "El alumno se desconectó a los diez minutos y no volvió a ingresar."
    ),
    student: party(
      "Sofía Ramírez",
      STUDENT,
      "Se me cortó internet y avisé por el chat de la plataforma."
    ),
  },
  {
    claimId: "claim-7",
    subjectName: "Estadística",
    status: "IN_REVIEW",
    sessionDate: "2026-08-05",
    tutorName: "Valeria Ortiz",
    studentName: "Mateo Ríos",
    assignedToName: "Moderador Laura P.",
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 8500,
    tutor: party("Valeria Ortiz", TUTOR, "El alumno no asistió y no respondió los mensajes."),
    student: party(
      "Mateo Ríos",
      STUDENT,
      "Confundí el horario y avisé cuando la sesión ya había terminado."
    ),
  },
  {
    claimId: "claim-8",
    subjectName: "Contabilidad",
    status: "IN_REVIEW",
    sessionDate: "2026-08-07",
    tutorName: "Gustavo Benítez",
    studentName: "Camila Torres",
    assignedToName: "Moderador Andrés M.",
    assignedToMe: false,
    resolutionJustification: null,
    heldAmount: 6000,
    tutor: party("Gustavo Benítez", TUTOR, "La sesión se desarrolló con normalidad."),
    student: party(
      "Camila Torres",
      STUDENT,
      "El tutor compartió material desactualizado y no respondió mis dudas."
    ),
  },
  {
    claimId: "claim-9",
    subjectName: "Biología Celular",
    status: "RESOLVED",
    sessionDate: "2026-07-15",
    tutorName: "Mariana Castro",
    studentName: "Agustín Prieto",
    assignedToName: MOCK_CURRENT_ADMIN_NAME,
    assignedToMe: true,
    resolutionJustification:
      "Se verificó la asistencia del alumno mediante el registro de la videollamada; se liberan los fondos al tutor.",
    heldAmount: 7500,
    tutor: party("Mariana Castro", TUTOR, "El alumno asistió solo los últimos quince minutos."),
    student: party("Agustín Prieto", STUDENT, "Llegué tarde por un examen previo."),
  },
  {
    claimId: "claim-10",
    subjectName: "Derecho Civil",
    status: "RESOLVED",
    sessionDate: "2026-07-18",
    tutorName: "Roberto Salas",
    studentName: "Valentina Ruiz",
    assignedToName: "Moderador Laura P.",
    assignedToMe: false,
    resolutionJustification:
      "El tutor no se presentó a la sesión; se reintegra el monto retenido al alumno.",
    heldAmount: 9500,
    tutor: party("Roberto Salas", TUTOR, "Tuve un problema familiar y no pude avisar."),
    student: party("Valentina Ruiz", STUDENT, "Esperé treinta minutos y nadie ingresó."),
  },
  {
    claimId: "claim-11",
    subjectName: "Inglés Técnico",
    status: "RESOLVED",
    sessionDate: "2026-07-20",
    tutorName: "Laura Méndez",
    studentName: "Facundo Gil",
    assignedToName: MOCK_CURRENT_ADMIN_NAME,
    assignedToMe: true,
    resolutionJustification:
      "La desconexión fue breve y ambos continuaron la clase por chat; se liberan los fondos al tutor.",
    heldAmount: 5500,
    tutor: party("Laura Méndez", TUTOR, "La clase se completó por chat."),
    student: party("Facundo Gil", STUDENT, "Se cortó la videollamada a los cinco minutos."),
  },
  {
    claimId: "claim-12",
    subjectName: "Marketing Digital",
    status: "RESOLVED",
    sessionDate: "2026-07-21",
    tutorName: "Andrés Molina",
    studentName: "Paula Suárez",
    assignedToName: "Moderador Andrés M.",
    assignedToMe: false,
    resolutionJustification:
      "Ambas partes acordaron un reintegro parcial por la demora en el inicio de la sesión.",
    heldAmount: 10000,
    tutor: party("Andrés Molina", TUTOR, "La sesión comenzó doce minutos tarde."),
    student: party("Paula Suárez", STUDENT, "El tutor llegó tarde y acortó la clase."),
  },
  {
    claimId: "claim-13",
    subjectName: "Redes de Datos",
    status: "IN_REVIEW",
    sessionDate: "2026-08-09",
    tutorName: "Federico Paz",
    studentName: "Martina Reyes",
    assignedToName: MOCK_CURRENT_ADMIN_NAME,
    assignedToMe: true,
    resolutionJustification: null,
    heldAmount: 12500,
    tutor: party(
      "Federico Paz",
      TUTOR,
      "El alumno canceló sobre la hora y solicitó el reintegro total."
    ),
    student: party(
      "Martina Reyes",
      STUDENT,
      "Tuve una emergencia familiar y avisé una hora antes."
    ),
  },
  {
    claimId: "claim-14",
    subjectName: "Sociología",
    status: "RESOLVED",
    sessionDate: "2026-07-23",
    tutorName: "Claudia Ferreyra",
    studentName: "Joaquín Medina",
    assignedToName: MOCK_CURRENT_ADMIN_NAME,
    assignedToMe: true,
    resolutionJustification:
      "Se validó el material compartido y la duración de la sesión; la resolución favorece al tutor.",
    heldAmount: 4800,
    tutor: party("Claudia Ferreyra", TUTOR, "Compartí la bibliografía completa durante la clase."),
    student: party("Joaquín Medina", STUDENT, null),
  },
];

function cloneClaim(claim: AdminSessionClaimDetailResponse): AdminSessionClaimDetailResponse {
  return { ...claim, tutor: { ...claim.tutor }, student: { ...claim.student } };
}

let claims: AdminSessionClaimDetailResponse[] = SEED_CLAIMS.map(cloneClaim);

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_LATENCY_MS);
  });
}

function apiError(message: string, status: number): Error {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: { status, data: { message } },
  });
}

function toListItem(claim: AdminSessionClaimDetailResponse): AdminSessionClaimListItem {
  return {
    claimId: claim.claimId,
    subjectName: claim.subjectName,
    status: claim.status,
    sessionDate: claim.sessionDate,
    tutorName: claim.tutorName,
    studentName: claim.studentName,
    assignedToName: claim.assignedToName,
    assignedToMe: claim.assignedToMe,
    resolutionJustification: claim.resolutionJustification,
  };
}

function findClaim(claimId: string): AdminSessionClaimDetailResponse {
  const claim = claims.find((item) => item.claimId === claimId);
  if (!claim) throw apiError("No encontramos el reclamo solicitado.", 404);
  return claim;
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.|\.$/g, "");
}

function buildContactInfo(claim: AdminSessionClaimDetailResponse): AdminClaimContactInfoResponse {
  const seed = Number(claim.claimId.replace("claim-", "")) || 1;
  const suffix = String(1000 + seed).padStart(4, "0");

  return {
    tutor: {
      fullName: claim.tutor.fullName,
      phone: `+54 11 5555-${suffix}`,
      email: `${slug(claim.tutor.fullName)}@knowlink.edu.ar`,
      institution: "Universidad de Buenos Aires",
      fileNumber: `LEG-${2000 + seed}`,
    },
    student: {
      fullName: claim.student.fullName,
      phone: `+54 11 4444-${suffix}`,
      email: `${slug(claim.student.fullName)}@knowlink.edu.ar`,
      nationalId: `38.${String(100 + seed)}.${String(400 + seed)}`,
    },
  };
}

export async function listMockSessionClaims(
  params: AdminSessionClaimListParams
): Promise<AdminSessionClaimListResponse> {
  await delay();

  const scoped = claims.filter((claim) => params.scope !== "mine" || claim.assignedToMe);
  const statusCounts = {
    open: scoped.filter((claim) => claim.status === "OPEN").length,
    inReview: scoped.filter((claim) => claim.status === "IN_REVIEW").length,
    resolved: scoped.filter((claim) => claim.status === "RESOLVED").length,
  };
  const filtered =
    params.status === "ALL" ? scoped : scoped.filter((claim) => claim.status === params.status);
  const start = (params.page - 1) * params.size;

  return {
    content: filtered.slice(start, start + params.size).map(toListItem),
    page: params.page - 1,
    size: params.size,
    totalElements: filtered.length,
    statusCounts,
  };
}

export async function getMockSessionClaimDetail(
  claimId: string
): Promise<AdminSessionClaimDetailResponse> {
  await delay();
  return cloneClaim(findClaim(claimId));
}

export async function assignMockSessionClaim(claimId: string): Promise<void> {
  await delay();
  const claim = findClaim(claimId);

  if (claim.status !== "OPEN") {
    throw apiError("La solicitud ya fue tomada por otro administrador.", 409);
  }

  claim.status = "IN_REVIEW";
  claim.assignedToName = MOCK_CURRENT_ADMIN_NAME;
  claim.assignedToMe = true;
}

export async function getMockClaimContactInfo(
  claimId: string
): Promise<AdminClaimContactInfoResponse> {
  await delay();
  return buildContactInfo(findClaim(claimId));
}

export async function resolveMockSessionClaim(
  claimId: string,
  payload: ResolveSessionClaimRequest
): Promise<void> {
  await delay();
  const claim = findClaim(claimId);

  if (claim.status === "RESOLVED") {
    throw apiError("El reclamo ya fue resuelto.", 409);
  }
  if (!claim.assignedToMe) {
    throw apiError("Solo el administrador asignado puede resolver este reclamo.", 403);
  }

  claim.status = "RESOLVED";
  claim.resolutionJustification = payload.justification.trim();
  claim.assignedToName = MOCK_CURRENT_ADMIN_NAME;
}

/** Restaura los datos de demo (útil en desarrollo manual). */
export function resetMockSessionClaims(): void {
  claims = SEED_CLAIMS.map(cloneClaim);
}
