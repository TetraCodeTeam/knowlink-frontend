import type { SlotStatus } from "@/modules/student/booking/interfaces/slotStatusType";

export interface MockBookingSlotEvent {
  id: string;
  start: string;
  end: string;
  status: SlotStatus;
}
