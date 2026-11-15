export type TeachingModality = "VIRTUAL" | "IN_PERSON" | "BOTH";

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
  institutionId: string;
  career: string;
  institutionalId?: string;
  /** Foto elegida en el formulario. Se envía como parte "file" del multipart de registro. */
  profilePictureFile?: File;
  biography?: string;
  address?: string;
  subjects: TutorSubjectRequest[];
}
