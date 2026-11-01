import type {
  CompensationFilter,
  SearchFilters,
  TimeFrameFilter,
  WeekDay,
} from "./interfaces/search-filters.interface";
import { applySearchFiltersToParams, hasActiveFilters } from "./utils/search-filters.utils";

export const STUDENTS_SEARCH_KEY = "students-search";

/**
 * Rol activo que bloquea el acceso al buscador (criterio de aceptación:
 * "Un usuario en modo tutor no puede acceder al buscador"). Confirmado
 * contra el backend real: com.knowlink.api.security.enums.Role = STUDENT | TUTOR | ADMIN,
 * y el endpoint de búsqueda exige @PreAuthorize("hasRole('STUDENT')").
 */
export const TUTOR_ROLE = "TUTOR";

export const WEEK_DAYS: { letter: string; value: WeekDay; label: string }[] = [
  { letter: "L", value: "MONDAY", label: "Lunes" },
  { letter: "M", value: "TUESDAY", label: "Martes" },
  { letter: "X", value: "WEDNESDAY", label: "Miércoles" },
  { letter: "J", value: "THURSDAY", label: "Jueves" },
  { letter: "V", value: "FRIDAY", label: "Viernes" },
  { letter: "S", value: "SATURDAY", label: "Sábado" },
  { letter: "D", value: "SUNDAY", label: "Domingo" },
];

export const TIME_FRAME_LABEL: Record<TimeFrameFilter, string> = {
  MORNING: "Mañana",
  AFTERNOON: "Tarde",
  EVENING: "Noche",
};

export const COMPENSATION_LABEL: Record<CompensationFilter, string> = {
  FREE: "Gratuito",
  PAID: "Pago",
};

export const EMPTY_FILTERED_MESSAGE = "No se encontraron tutores para los filtros seleccionados";
export const EMPTY_SEARCH_MESSAGE = "No se encontraron resultados para tu búsqueda";

/**
 * El endpoint de búsqueda no expone un materiaId (no hay entidad "materia"
 * separada en la respuesta, solo el nombre). Se navega por nombre; la página
 * de destino debería volver a llamar a /api/v1/tutors/search/{nombre} para
 * listar todos los tutores que la ofrecen.
 */
export function buildMateriaTutorsRoute(materiaNombre: string, filters?: SearchFilters): string {
  return appendFilters(`/student/tutores?materia=${encodeURIComponent(materiaNombre)}`, filters);
}

export function buildTutorProfileRoute(tutorId: string): string {
  return `/student/tutor/${tutorId}`;
}

export function buildSearchResultsRoute(query: string, filters?: SearchFilters): string {
  return appendFilters(`/student/buscar?q=${encodeURIComponent(query)}`, filters);
}

export const MAX_SEARCH_SUGGESTIONS = 4;

/**
 * Agrega los parámetros de filtro a una URL relativa existente sin tocar el
 * resto de las claves (q, materia, etc.). Con filtros vacíos devuelve la URL
 * original tal cual, para no alterar el comportamiento previo.
 */
function appendFilters(url: string, filters?: SearchFilters): string {
  if (!filters || !hasActiveFilters(filters)) return url;

  const [pathname, search = ""] = url.split("?");
  const params = applySearchFiltersToParams(new URLSearchParams(search), filters);

  return `${pathname}?${params.toString()}`;
}
