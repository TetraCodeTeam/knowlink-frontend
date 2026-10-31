import type { SlotStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";

export interface BookingSlotStatusEvent {
  slotId: string;
  status: SlotStatus;
  windowStart?: string;
  windowEnd?: string;
}
