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
