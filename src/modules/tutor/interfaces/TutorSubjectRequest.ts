export type ModalityRequest = "VIRTUAL" | "IN_PERSON" | "BOTH";
export type CompensationTypeRequest = "FREE" | "PAID";

export interface TutorSubjectRequest {
  subjectName: string;
  modality: ModalityRequest;
  compensationType: CompensationTypeRequest;
  pricePerHour: number | null;
}