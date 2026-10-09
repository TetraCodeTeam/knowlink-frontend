import type { Modality } from "@/modules/tutor/types/modality.type";

export interface BookingHistoryDetail {
    bookingId: string;
    otherPartyFullName: string;
    otherPartyProfilePictureUrl: string | null;
    subjectName: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    modality: Modality;
    status: string;
    amount: number;
    topic: string;
    virtualSessionLink: string | null; // solo si modality === "VIRTUAL"
    address: string | null; // solo si modality === "IN_PERSON"
    createdAt: string;
}