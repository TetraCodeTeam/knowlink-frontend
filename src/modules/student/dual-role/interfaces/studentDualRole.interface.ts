export interface TutorSubjectForActivation {
  subjectId: string;
  modality: "VIRTUAL" | "IN_PERSON" | "BOTH";
  compensationType: "FREE" | "PAID";
  pricePerHour?: number;
}

export interface ActivateTutorRoleRequest {
  biography: string;
  address: string;
  subjects: TutorSubjectForActivation[];
}

export interface ActivateTutorRoleResponse {
  token: string;
}
