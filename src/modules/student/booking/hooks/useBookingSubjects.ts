//Hook que proporciona una lista de materias disponibles para reservar. Actualmente devuelve datos mockeados
import { MOCK_SUBJECTS } from "@/modules/student/booking/mockdata";

export function useBookingSubjects() {
  return MOCK_SUBJECTS;
}