export const STUDENTS_SEARCH_KEY = "students-search";

/**
 * Rol activo que bloquea el acceso al buscador (criterio de aceptación:
 * "Un usuario en modo tutor no puede acceder al buscador"). Confirmado
 * contra el backend real: com.knowlink.api.security.enums.Role = STUDENT | TUTOR | ADMIN,
 * y el endpoint de búsqueda exige @PreAuthorize("hasRole('STUDENT')").
 */
export const TUTOR_ROLE = "TUTOR";

/**
 * El endpoint de búsqueda no expone un materiaId (no hay entidad "materia"
 * separada en la respuesta, solo el nombre). Se navega por nombre; la página
 * de destino debería volver a llamar a /api/v1/tutors/search/{nombre} para
 * listar todos los tutores que la ofrecen.
 */
export function buildMateriaTutorsRoute(materiaNombre: string): string {
  return `/tutores?materia=${encodeURIComponent(materiaNombre)}`;
}

export function buildTutorProfileRoute(tutorId: string): string {
  return `/tutores/${tutorId}`;
}

