// API de sincronización en tiempo real para recibir cambios de estado de los slots de reserva.
// Utiliza SSE (Server-Sent Events) para mantener actualizado el calendario cuando otro usuario bloquea, reserva o libera un slot.
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { BookingSlotStatusEvent } from "@/modules/student/booking/interfaces/responses/booking-slot-status-event.interface";
export type { BookingSlotStatusEvent } from "@/modules/student/booking/interfaces/responses/booking-slot-status-event.interface";

const BOOKING_STATUS_EVENT = "knowlink:booking-slot-status";
const REALTIME_ENABLED = import.meta.env.VITE_BOOKING_REALTIME_ENABLED === "true";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export function publishBookingSlotStatus(event: BookingSlotStatusEvent) {
  window.dispatchEvent(new CustomEvent<BookingSlotStatusEvent>(BOOKING_STATUS_EVENT, { detail: event }));
}

export function subscribeToBookingSlotEvents(
  tutorId: string,
  onEvent: (event: BookingSlotStatusEvent) => void,
  onError?: (error: unknown) => void
): () => void {
  if (!REALTIME_ENABLED) return () => undefined;

  const controller = new AbortController();
  let reconnectTimer: number | undefined;
  let closed = false;

  const connect = async () => {
    try {
      const token = useAuthStore.getState().authResponse?.token;
      const response = await fetch(
        `${BASE_URL}/api/v1/tutors/${encodeURIComponent(tutorId)}/booking-slots/events`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}`, Accept: "text/event-stream" }
            : { Accept: "text/event-stream" },
          signal: controller.signal,
        }
      );

      if (!response.ok || !response.body) throw new Error(`SSE connection failed (${response.status})`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!closed) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() ?? "";

        for (const message of messages) {
          const data = message
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim())
            .join("\n");
          if (!data) continue;
          onEvent(JSON.parse(data) as BookingSlotStatusEvent);
        }
      }
    } catch (error) {
      if (!closed) {
        onError?.(error);
        reconnectTimer = window.setTimeout(connect, 3000);
      }
    }
  };

  void connect();
  return () => {
    closed = true;
    controller.abort();
    if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
  };
}
