import type { BookingStatus } from "@/modules/class-history/types/booking-status.type";
import type { RefundDestination } from "@/modules/class-history/types/refund-destination.type";
import type { RefundPolicy } from "@/modules/class-history/types/refund-policy.type";

export interface BookingCancellationResponse {
  bookingId: string;
  bookingStatus: BookingStatus;
  cancellationId: string;
  refundDestination: RefundDestination;
  refundPolicy: RefundPolicy;
  amount: number;
  hoursInAdvance: number | null;
  createdAt: string;
}
