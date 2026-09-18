import type { Modality } from "@/modules/tutor/types/modality.type";

export interface BookingHistoryItem {
    bookingId: string;
    otherPartyFullName: string;
    otherPartyProfilePictureUrl: string | null;
    subjectName: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    modality: Modality;
    status: string;
}