import type { Modality } from "@/modules/tutor/profile/components/ModalityChip";

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