import type { ClaimReason } from "@/modules/claim/interfaces/claimReasonType";
import type { Role } from "@/shared/types/role.type";

/**
 * Los motivos del backend describen la perspectiva de quien reclama:
 * STUDENT_COULD_NOT_ATTEND (el alumno no asistió) o I_COULD_NOT_ATTEND
 * (quien reclama no pudo asistir). El backend no tiene un motivo
 * "el tutor no asistió", así que el alumno solo puede declarar el segundo.
 *
 * El orden de las claves define el orden de render.
 */
export const CLAIM_REASON_LABEL: Record<Role, Partial<Record<ClaimReason, string>>> = {
  TUTOR: {
    STUDENT_COULD_NOT_ATTEND: "El alumno no asistió",
    I_COULD_NOT_ATTEND: "Yo no pude asistir",
  },
  STUDENT: {
    I_COULD_NOT_ATTEND: "Yo no pude asistir",
  },
};

type ReasonList = [ClaimReason, ...ClaimReason[]];

const reasonsFor = (role: Role) =>
  Object.keys(CLAIM_REASON_LABEL[role]) as ReasonList;

/** Motivos a renderizar por rol, derivados del mapa. */
export const CLAIM_REASONS_BY_ROLE: Record<Role, ReasonList> = {
  TUTOR: reasonsFor("TUTOR"),
  STUDENT: reasonsFor("STUDENT"),
};

/** Todos los motivos posibles, para el z.enum del schema. */
export const CLAIM_REASONS: ReasonList = ["STUDENT_COULD_NOT_ATTEND", "I_COULD_NOT_ATTEND"];
