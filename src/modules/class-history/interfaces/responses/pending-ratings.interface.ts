import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

export interface PendingRatingItem {
  bookingId: string;
  raterRole: BookingRole;
  subjectName: string;
  otherPartyFullName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
}

export interface PendingRatingsResponse {
  blocking: PendingRatingItem[];
  nextBlockAt: string | null;
}
