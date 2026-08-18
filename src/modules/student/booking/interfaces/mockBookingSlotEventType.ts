import type { SlotStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";

export interface MockBookingSlotEvent {
  id: string;
  start: string;
  end: string;
  status: SlotStatus;
}
