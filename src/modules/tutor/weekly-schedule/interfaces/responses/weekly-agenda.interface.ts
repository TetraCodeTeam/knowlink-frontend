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
 * NOTA: por ahora se arma en el frontend pegando availability + reservas
 * por separado (el tutor va a conectar el endpoint real más adelante);
 * este tipo ya representa la forma final esperada para no romper el
 * resto del código cuando se conecte el fetch de verdad.
 */
export interface WeeklyAgendaResponse {
  weekStart: string; // "YYYY-MM-DD", lunes de la semana visible
  availabilityBlocks: AvailabilityBlockResponse[];
  bookedSessions: BookedSessionResponse[];
}
