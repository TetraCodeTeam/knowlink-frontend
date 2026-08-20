//Hook para manejar la sincronización en tiempo real de los slots de reserva.
import { useEffect, useState } from "react";
import {
  holdBookingSlot,
  releaseBookingSlot,
  reserveBooking,
} from "@/modules/student/booking/api/booking.api";
import {
  publishBookingSlotStatus,
  subscribeToBookingSlotEvents,
} from "@/modules/student/booking/api/bookingSlotsRealtime.api";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import { getBookingBlockId } from "@/modules/student/booking/api/booking.api";
import type { BookingSlotStatusEvent } from "@/modules/student/booking/interfaces/responses/bookingSlotStatusEvent.interface";
import type { BookingUnavailableWindow } from "@/modules/student/booking/interfaces/bookingUnavailableWindowType";
import { useBookingSlots } from "@/modules/student/booking/hooks/useBookingSlots";

export function useBookingRealtime(tutorId = "mock-tutor") {
  const [bookingSlots, setBookingSlots] = useState(useBookingSlots());

  useEffect(() => {
    const applyEvent = (event: BookingSlotStatusEvent) => {
      setBookingSlots((current) =>
        current.map((slot) => {
          if (slot.id !== event.slotId && slot.id !== getBookingBlockId(event.slotId)) return slot;
          if (!event.windowStart || !event.windowEnd) return { ...slot, status: event.status };

          const nextWindow: BookingUnavailableWindow = {
            start: event.windowStart,
            end: event.windowEnd,
            status: event.status === "AVAILABLE" ? "BLOCKED" : event.status,
          };
          const currentWindows = slot.unavailableWindows ?? [];
          const nextWindows = currentWindows.filter(
            (window) => window.start !== event.windowStart || window.end !== event.windowEnd
          );

          return {
            ...slot,
            unavailableWindows:
              event.status === "AVAILABLE" ? nextWindows : [...nextWindows, nextWindow],
          };
        })
      );
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
    const blockId = slot.id.split("__")[0];
    publishBookingSlotStatus({
      slotId: blockId,
      status: "BLOCKED",
      windowStart: slot.startIso,
      windowEnd: slot.endIso,
    });

    try {
      await holdBookingSlot(tutorId, slot);
    } catch (error) {
      publishBookingSlotStatus({
        slotId: blockId,
        status: "AVAILABLE",
        windowStart: slot.startIso,
        windowEnd: slot.endIso,
      });
      throw error;
    }
  };

  const reserveSlot = async (slot: BookingSlot, data: BookingFormValues) => {
    await reserveBooking(tutorId, slot, data);
    publishBookingSlotStatus({
      slotId: getBookingBlockId(slot.id),
      status: "RESERVED",
      windowStart: slot.startIso,
      windowEnd: slot.endIso,
    });
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

  return { bookingSlots, holdSlot, reserveSlot, releaseSlot };
}