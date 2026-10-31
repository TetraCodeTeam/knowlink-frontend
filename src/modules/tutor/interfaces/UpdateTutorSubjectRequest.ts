import type {
  CompensationTypeRequest,
  ModalityRequest,
} from "@/modules/tutor/interfaces/TutorSubjectRequest";

export interface UpdateTutorSubjectRequest {
  modality: ModalityRequest;
  compensationType: CompensationTypeRequest;
  pricePerHour: number | null;
}
