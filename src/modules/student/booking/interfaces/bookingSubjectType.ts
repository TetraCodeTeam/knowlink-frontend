import type { Modality } from "@/modules/student/booking/constants/modality.constants";

export interface BookingSubject {
  id: string;
  name: string;
  hourlyRate: number;
  availableModalities: Modality[];
  address?: string;
}
