import type { SlotStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";
import type { BookingUnavailableWindow } from "@/modules/student/booking/interfaces/bookingUnavailableWindowType";

export interface MockBookingSlotEvent {
  id: string;
  start: string;
  end: string;
  status: SlotStatus;
  unavailableWindows?: BookingUnavailableWindow[];
}
