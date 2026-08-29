//Hook que proporciona una lista de horarios disponibles para reservar. Actualmente devuelve datos mockeados
import { MOCK_BOOKING_SLOTS } from "@/modules/student/booking/mockBookingSlots";

export function useBookingSlots() {
  return MOCK_BOOKING_SLOTS;
}