// Mock temporal: reemplazar cuando exista  el endpoint real de materias.
import type { BookingSubject } from "@/modules/student/booking/interfaces/bookingSubjectType";

export const MOCK_SUBJECTS: BookingSubject[] = [
  {
    id: "matematica-i",
    name: "Matemática I",
    hourlyRate: 3500,
    availableModalities: ["IN_PERSON"],
    address: "Calle Falsa 123, Ciudad, País",
  },
  {
    id: "algoritmos",
    name: "Algoritmos y Estructuras de Datos",
    hourlyRate: 4200,
    availableModalities: ["VIRTUAL"],
  },
  {
    id: "fisica-ii",
    name: "Física II",
    hourlyRate: 0,
    availableModalities: ["VIRTUAL", "IN_PERSON"],
  },
  {
    id: "bases-de-datos",
    name: "Bases de Datos",
    hourlyRate: 4000,
    availableModalities: ["VIRTUAL"],
  },
];

export const SERVICE_FEE_RATE = 0.03;

export const MOCK_MINIMUM_NOTICE_MINUTES = 18 * 60;
