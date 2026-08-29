// Hook para manejar la sincronización en tiempo real de los slots de reserva.
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  holdBookingSlot,
  releaseBookingSlot,
  reserveBooking,
  getBookingBlockId,
} from "@/modules/student/booking/api/booking.api";
import {
  publishBookingSlotStatus,
  subscribeToBookingSlotEvents,
} from "@/modules/student/booking/api/bookingSlotsRealtime.api";
import { useBookingSlots } from "@/modules/student/booking/hooks/useBookingSlots";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import type { BookingSlotStatusEvent } from "@/modules/student/booking/interfaces/responses/bookingSlotStatusEvent.interface";
import type { BookingUnavailableWindow } from "@/modules/student/booking/interfaces/bookingUnavailableWindowType";
import type { MockBookingSlotEvent } from "@/modules/student/booking/interfaces/mockBookingSlotEventType";

// Clave "slotId|windowStart|windowEnd" -> ventana pisada localmente por un
// evento (SSE o publicación optimista propia), aplicada por encima de lo
// que trae la query. `null` significa "liberada" (AVAILABLE).
type WindowOverrides = Record<string, BookingUnavailableWindow | null>;

export function useBookingRealtime(tutorId: string, from: string, to: string) {
  const { data, isLoading } = useBookingSlots(tutorId, from, to);
  const [overrides, setOverrides] = useState<WindowOverrides>({});
  const queryClient = useQueryClient();

  const bookingSlots: MockBookingSlotEvent[] = useMemo(() => {
    const baseSlots = data?.slots ?? [];

    return baseSlots.map((slot) => {
      const relevantOverrides = Object.entries(overrides).filter(([key]) => key.startsWith(`${slot.id}|`));
      if (relevantOverrides.length === 0) return slot;

      let nextWindows = [...(slot.unavailableWindows ?? [])];
      for (const [key, override] of relevantOverrides) {
        const [, windowStart, windowEnd] = key.split("|");
        nextWindows = nextWindows.filter((w) => !(w.start === windowStart && w.end === windowEnd));
        if (override) nextWindows.push(override);
      }
      return { ...slot, unavailableWindows: nextWindows };
    });
  }, [data, overrides]);

  useEffect(() => {
    const applyEvent = (event: BookingSlotStatusEvent) => {
      if (!event.windowStart || !event.windowEnd) return;

      const blockId = getBookingBlockId(event.slotId);
      const key = `${blockId}|${event.windowStart}|${event.windowEnd}`;

      setOverrides((current) => ({
        ...current,
        [key]:
          event.status === "AVAILABLE"
            ? null
            : { start: event.windowStart!, end: event.windowEnd!, status: event.status },
      }));
    };

    const handleLocalEvent = (event: Event) => {
      applyEvent((event as CustomEvent<BookingSlotStatusEvent>).detail);
    };

    window.addEventListener("knowlink:booking-slot-status", handleLocalEvent);
    const unsubscribe = subscribeToBookingSlotEvents(tutorId, applyEvent);

    return () => {
      window.removeEventListener("knowlink:booking-slot-status", handleLocalEvent);
      unsubscribe();
    };
  }, [tutorId]);

  const holdSlot = async (slot: BookingSlot) => {
    const blockId = getBookingBlockId(slot.id);
    publishBookingSlotStatus({ slotId: blockId, status: "BLOCKED", windowStart: slot.startIso, windowEnd: slot.endIso });
    try {
      await holdBookingSlot(tutorId, slot);
    } catch (error) {
      publishBookingSlotStatus({ slotId: blockId, status: "AVAILABLE", windowStart: slot.startIso, windowEnd: slot.endIso });
      throw error;
    }
  };

  const reserveSlot = async (slot: BookingSlot, formData: BookingFormValues) => {
    await reserveBooking(tutorId, slot, formData);
    publishBookingSlotStatus({
      slotId: getBookingBlockId(slot.id),
      status: "RESERVED",
      windowStart: slot.startIso,
      windowEnd: slot.endIso,
    });
    await queryClient.invalidateQueries({ queryKey: ["booking-calendar", tutorId] });
  };

  const releaseSlot = async (slot: BookingSlot) => {
    await releaseBookingSlot(tutorId, slot);
    publishBookingSlotStatus({
      slotId: getBookingBlockId(slot.id),
      status: "AVAILABLE",
      windowStart: slot.startIso,
      windowEnd: slot.endIso,
    });
  };

  return {
    bookingSlots,
    isLoading,
    minimumNoticeMinutes: data?.minimumNoticeMinutes ?? 0,
    holdSlot,
    reserveSlot,
    releaseSlot,
  };
}