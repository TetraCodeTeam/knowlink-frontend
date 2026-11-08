import type { RatingStatus } from "@/modules/class-history/types/rating-status.type";
import type { Modality } from "@/modules/tutor/types/modality.type";

export interface RateBookingSummary {
  subjectName: string;
  otherPartyFullName: string;
  sessionDate: string;
}

export interface BookingHistoryDetail extends RateBookingSummary {
  bookingId: string;
  otherPartyProfilePictureUrl: string | null;
  startTime: string;
  endTime: string;
  modality: Modality;
  status: string;
  amount: number;
  topic: string;
  virtualSessionLink: string | null; // solo si modality === "VIRTUAL"
  address: string | null; // solo si modality === "IN_PERSON"
  createdAt: string;
  ratingStatus: RatingStatus;
}
