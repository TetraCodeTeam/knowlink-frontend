import type { SelectableSlot } from "@/modules/student/booking/interfaces/bookingSlotType";

interface SlotWindow {
  start: Date;
  end: Date;
}

export function buildSelectableSlot(blockId: string, window: SlotWindow): SelectableSlot {
  const durationHours = (window.end.getTime() - window.start.getTime()) / (60 * 60 * 1000);

  return {
    id: `${blockId}__${window.start.toISOString()}__${window.end.toISOString()}`,
    startIso: window.start.toISOString(),
    endIso: window.end.toISOString(),
    date: window.start.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }),
    startTime: window.start.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    endTime: window.end.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    durationHours,
  };
}