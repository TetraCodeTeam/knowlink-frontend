export type TeachingModality = "VIRTUAL" | "IN_PERSON";

export type CompensationType = "FREE" | "PAID";

export interface TutorSubjectRequest {
  subjectName: string;
  modality: TeachingModality;
  compensationType: CompensationType;
  pricePerHour?: number | null;
}

export interface TutorRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  career: string;
  institutionalId?: string;
  profilePictureUrl?: string;
  biography?: string;
  address?: string;
  subjects: TutorSubjectRequest[];
}
