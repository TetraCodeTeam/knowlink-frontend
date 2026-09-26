import type { CancellationRole } from "@/modules/class-history/types/cancellation-role.type";
import type { RefundDestination } from "@/modules/class-history/types/refund-destination.type";
import type { RefundPolicy } from "@/modules/class-history/types/refund-policy.type";

export interface CancellationPreview {
  bookingId: string;
  cancellationRole: CancellationRole;
  hoursInAdvance: number | null;
  refundDestination: RefundDestination;
  amount: number;
  refundPolicy: RefundPolicy;
}
