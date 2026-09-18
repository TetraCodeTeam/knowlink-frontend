// API de comandos de reserva: mantiene los slots temporalmente bloqueados, confirma reservas y libera bloqueos.
// Estas funciones encapsulan las solicitudes HTTP que conectarán el flujo de booking con el backend.
import { httpClient, rawHttpClient } from "@/shared/lib/httpClient";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import type { BookingRequest } from "@/modules/student/booking/interfaces/requests/bookingRequest.interface";
import type { BookingCalendarApiResponse } from "@/modules/student/booking/interfaces/responses/bookingCalendar.interface";
import type { HoldResult } from "@/modules/student/booking/interfaces/holdResultType";
import type { ActiveHoldStatusResponse } from "@/modules/student/booking/interfaces/responses/activeHoldStatus.interface";

export function getBookingBlockId(slotId: string): string {
  return slotId.split("__")[0];
}

export async function holdBookingSlot(tutorId: string, slot: BookingSlot): Promise<HoldResult> {
  const { data } = await rawHttpClient.post<{ expiresAt: string }>(
    `/api/v1/tutors/${encodeURIComponent(tutorId)}/booking-slots/hold`,
    { slotId: getBookingBlockId(slot.id), start: slot.startIso, end: slot.endIso }
  );
  return { expiresAt: data.expiresAt };
}

export async function reserveBooking(
  tutorId: string,
  slot: BookingSlot,
  data: BookingFormValues
): Promise<void> {
  const request: BookingRequest = {
    ...data,
    tutorId,
    start: slot.startIso,
    end: slot.endIso,
  };
  await rawHttpClient.post("/api/v1/bookings", request);
}

export async function releaseBookingSlot(tutorId: string, slot: BookingSlot): Promise<void> {
  await httpClient.delete(`/api/v1/tutors/${encodeURIComponent(tutorId)}/booking-slots/hold`, {
    data: { slotId: getBookingBlockId(slot.id), start: slot.startIso, end: slot.endIso },
  });
}

export async function getBookingCalendar(
  tutorId: string,
  from: string,
  to: string
): Promise<BookingCalendarApiResponse> {
  const { data } = await httpClient.get<BookingCalendarApiResponse>(
    `/api/v1/tutors/${encodeURIComponent(tutorId)}/booking-slots`,
    { params: { from, to } }
  );
  return data;
}

export async function getBookingConfig(): Promise<{ serviceFeeRate: number }> {
  const { data } = await httpClient.get<{ serviceFeeRate: number }>("/api/v1/bookings/config");
  return data;
}

export async function getActiveHold(): Promise<ActiveHoldStatusResponse> {
  const { data } = await httpClient.get<ActiveHoldStatusResponse>("/api/v1/bookings/active-hold");
  return data;
}