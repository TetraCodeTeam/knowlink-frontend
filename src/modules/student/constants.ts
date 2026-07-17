export const STUDENTS_SEARCH_KEY = "students-search";

/**
 * Rol activo que bloquea el acceso al buscador (criterio de aceptación:
 * "Un usuario en modo tutor no puede acceder al buscador").
 *
 * NOTA: el backend público todavía no expone un modelo de "modo activo"
 * alumno/tutor (por ahora `Role` solo tiene ADMIN/USER). Ajustar este valor
 * cuando el contrato real de roles/modo esté definido.
 */
export const TUTOR_ROLE = "TUTOR";

export function buildMateriaTutorsRoute(materiaId: string): string {
  return `/materias/${materiaId}/tutores`;
}

export function buildTutorProfileRoute(tutorId: string): string {
  return `/tutores/${tutorId}`;
}
