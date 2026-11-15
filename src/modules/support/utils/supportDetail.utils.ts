import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";

export function formatSupportAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSupportReason(reason: string): string {
  const labels: Record<string, string> = {
    STUDENT_COULD_NOT_ATTEND: "El alumno no pudo asistir",
    TUTOR_COULD_NOT_ATTEND: "El tutor no pudo asistir",
    I_COULD_NOT_ATTEND: "No pude asistir",
  };
  return labels[reason] ?? reason.replaceAll("_", " ").toLowerCase();
}

export function formatReviewPhase(phase: string): string {
  const labels: Record<string, string> = {
    MEDIATOR_ASSIGNMENT_QUEUED: "Asignación de mediador en cola",
    IN_REVIEW: "Revisión en curso",
    RESOLVED: "Reclamo resuelto",
  };
  return labels[phase] ?? phase.replaceAll("_", " ").toLowerCase();
}
export function formatQueuePosition(position: number, total: number | null): string {
  return total != null
    ? `Lugar ${position} de ${total} en la cola de casos pendientes`
    : `Turno #${position}`;
}

/**
 * Nota de "Fondos y garantía". Un reclamo resuelto nunca muestra el mensaje de
 * liberación pendiente; la nota solo aparece si funds ya indica a quién se liberó.
 */
export function formatFundsNote(status: ClaimStatus, fundsStatus: string | null): string | null {
  if (status !== "RESOLVED") {
    return "Los fondos se liberarán automáticamente al finalizar la revisión.";
  }
  if (fundsStatus === "RELEASED_TO_TUTOR") return "Fondos liberados al tutor.";
  if (fundsStatus === "REFUNDED_TO_STUDENT") return "Fondos liberados al alumno.";
  return null;
}
