import type { SlotStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";

export interface BookingUnavailableWindow {
  start: string;
  end: string;
  status: Exclude<SlotStatus, "AVAILABLE">;
}
