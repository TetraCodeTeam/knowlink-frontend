import { useEffect, useState } from "react";
import {
  holdBookingSlot,
  releaseBookingSlot,
  reserveBooking,
} from "@/modules/student/booking/api/booking.api";
import {
  publishBookingSlotStatus,
  subscribeToBookingSlotEvents,
  type BookingSlotStatusEvent,
} from "@/modules/student/booking/api/bookingSlotsRealtime.api";
import type { BookingFormValues } from "@/modules/student/booking/schemas/booking.schema";
import type { BookingSlot } from "@/modules/student/booking/interfaces/bookingSlotType";
import { useBookingSlots } from "@/modules/student/booking/hooks/useBookingSlots";

export function useBookingRealtime(tutorId = "mock-tutor") {
  const [bookingSlots, setBookingSlots] = useState(useBookingSlots());

  useEffect(() => {
    const applyEvent = (event: BookingSlotStatusEvent) => {
      setBookingSlots((current) =>
        current.map((slot) => (slot.id === event.slotId ? { ...slot, status: event.status } : slot))
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
    publishBookingSlotStatus({ slotId: blockId, status: "BLOCKED" });

    try {
      await holdBookingSlot(tutorId, slot);
    } catch (error) {
      publishBookingSlotStatus({ slotId: blockId, status: "AVAILABLE" });
      throw error;
    }
  };

  const reserveSlot = async (slot: BookingSlot, data: BookingFormValues) => {
    await reserveBooking(tutorId, slot, data);
    publishBookingSlotStatus({ slotId: slot.id.split("__")[0], status: "RESERVED" });
  };

  const releaseSlot = async (slot: BookingSlot) => {
    await releaseBookingSlot(tutorId, slot);
    publishBookingSlotStatus({ slotId: slot.id.split("__")[0], status: "AVAILABLE" });
  };

  return { bookingSlots, holdSlot, reserveSlot, releaseSlot };
}