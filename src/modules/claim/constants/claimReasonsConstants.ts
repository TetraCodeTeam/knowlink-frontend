import type { ClaimReason } from "@/modules/claim/interfaces/claimReasonType";
import type { ClaimBlockReason } from "@/modules/claim/interfaces/claimReasonType";
import type { Role } from "@/shared/types/role.type";

/** Las opciones permitidas se toman de ClaimEligibility.allowedReasons. */
export const CLAIM_REASON_LABEL: Record<Role, Record<ClaimReason, string>> = {
  TUTOR: {
    STUDENT_COULD_NOT_ATTEND: "El alumno no asistió",
    TUTOR_COULD_NOT_ATTEND: "Yo no pude asistir",
    I_COULD_NOT_ATTEND: "Yo no pude asistir",
  },
  STUDENT: {
    STUDENT_COULD_NOT_ATTEND: "El alumno no asistió",
    TUTOR_COULD_NOT_ATTEND: "El tutor no asistió",
    I_COULD_NOT_ATTEND: "Yo no pude asistir",
  },
};

/** Mensajes de bloqueo devueltos por el endpoint de elegibilidad. */
export const CLAIM_BLOCK_REASON_MESSAGE: Record<ClaimBlockReason, string> = {
  SESSION_NOT_PARTICIPANT: "No participás de esta sesión.",
  SESSION_NOT_FINALIZED: "La sesión todavía no está finalizada.",
  SESSION_ALREADY_CONFIRMED: "La sesión ya fue confirmada y no admite reclamos.",
  SESSION_NOT_CLAIMABLE: "Esta sesión no cumple las condiciones para iniciar un reclamo.",
  CLAIM_DEADLINE_EXCEEDED: "Venció el plazo para iniciar un reclamo.",
  ACTIVE_CLAIM_EXISTS: "Ya tenés un reclamo abierto para esta sesión.",
};
