import type { MODALITY_OPTIONS } from "@/shared/constants/modality";

/**
 * Bloque de disponibilidad configurado por el tutor (US-09).
 * Representa un slot que aún puede ser reservado por un alumno.
 */
export interface AvailabilityBlockResponse {
  id: string;
  dayOfWeek: number; // 0 (domingo) a 6 (sábado), estándar ISO/JS Date
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

/**
 * Reserva confirmada que ocupa un bloque de disponibilidad (US-10).
 * Es la información mínima que la agenda necesita para pintar el bloque
 * "reservado"; el detalle completo de la reserva vive en US-13.
 */
export interface BookedSessionResponse {
  id: string;
  subjectName: string;
  studentName: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  modality: typeof MODALITY_OPTIONS[number];
}

/**
 * Respuesta combinada que consume la pantalla de agenda semanal.
 * Corresponde al resultado mapeado desde el endpoint semanal del backend.
 */
export interface WeeklyAgendaResponse {
  weekStart: string; // "YYYY-MM-DD", lunes de la semana visible
  availabilityBlocks: AvailabilityBlockResponse[];
  bookedSessions: BookedSessionResponse[];
}
