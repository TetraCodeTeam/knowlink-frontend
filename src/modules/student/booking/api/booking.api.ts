// API de comandos de reserva: mantiene los slots temporalmente bloqueados, confirma reservas y libera bloqueos.
// Estas funciones encapsulan las solicitudes HTTP que conectarán el flujo de booking con el backend.
import { httpClient } from "@/shared/lib/httpClient";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import type { BookingRequest } from "@/modules/student/booking/interfaces/requests/bookingRequest.interface";

//realtime_enabled permite deshabilitar la sincronización y peticiones de back. Cuando se implemente el backend, se puede eliminar esta variable y sus condicionales.
const REALTIME_ENABLED = import.meta.env.VITE_BOOKING_REALTIME_ENABLED === "true";

export function getBookingBlockId(slotId: string): string {
  return slotId.split("__")[0];
}

export async function holdBookingSlot(tutorId: string, slot: BookingSlot): Promise<void> {
  if (!REALTIME_ENABLED) return;
  await httpClient.post(`/api/v1/tutors/${encodeURIComponent(tutorId)}/booking-slots/hold`, {
    slotId: getBookingBlockId(slot.id),
    start: slot.startIso,
    end: slot.endIso,
  });
}

export async function reserveBooking(tutorId: string, slot: BookingSlot, data: BookingFormValues): Promise<void> {
  if (!REALTIME_ENABLED) return;
  const request: BookingRequest = {
    ...data,
    tutorId,
    start: slot.startIso,
    end: slot.endIso,
  };
  await httpClient.post("/api/v1/bookings", request);
}

export async function releaseBookingSlot(tutorId: string, slot: BookingSlot): Promise<void> {
  if (!REALTIME_ENABLED) return;
  await httpClient.delete(`/api/v1/tutors/${encodeURIComponent(tutorId)}/booking-slots/hold`, {
    data: { slotId: getBookingBlockId(slot.id), start: slot.startIso, end: slot.endIso },
  });
}
