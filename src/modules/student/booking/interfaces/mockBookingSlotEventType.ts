import type { SlotStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";

export interface BookingUnavailableWindow {
  start: string;
  end: string;
  status: Exclude<SlotStatus, "AVAILABLE">;
}

export interface MockBookingSlotEvent {
  id: string;
  start: string;
  end: string;
  status: SlotStatus;
  unavailableWindows?: BookingUnavailableWindow[];
}
