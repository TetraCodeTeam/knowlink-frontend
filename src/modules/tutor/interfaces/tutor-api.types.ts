/**
 * Types that mirror the backend API response exactly.
 * These are separate from the frontend's TutorProfile interface,
 * which is used by the UI components.
 */

export interface TutorSubjectApiResponse {
  materia: string;
  descripcion: string | null;
  modalidad: string;
  tipoCompensacion: string;
  precio: number | null;
}

export interface TutorReviewApiResponse {
  puntuacion: number;
  comentario: string | null;
  fechaCalificacion: string; // ISO string from LocalDateTime
}

export interface TutorAvailabilityApiResponse {
  dia: string;
  horaInicio: string; // ISO string from LocalTime
  horaFin: string;
}

export interface TutorMaterialApiResponse {
  nome: string;
  urlArchivo: string;
  fechaSubida: string; // ISO string from LocalDateTime
}

export interface TutorProfileApiResponse {
  id: string;
  nombreCompleto: string;
  biografia: string | null;
  carrera: string | null;
  fotoPerfil: string | null;
  verificado: boolean;
  calificacionPromedio: number | null;
  materias: TutorSubjectApiResponse[];
  calificaciones: TutorReviewApiResponse[];
  disponibilidad: TutorAvailabilityApiResponse[];
  materiales: TutorMaterialApiResponse[];
}
