import type { Modality } from "@/modules/student/booking/interfaces/modalityType";

export interface BookingSubject {
  id: string;
  name: string;
  hourlyRate: number;
  availableModalities: Modality[];
  address?: string;
}
