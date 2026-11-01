export type TutorModality = "VIRTUAL" | "IN_PERSON" | "BOTH";

export interface TutorOwnSubject {
  tutorSubjectId: string;
  subjectName: string;
  averageRating: number | null;
  reviewCount: number | null;
  modality: TutorModality;
  compensationType: "FREE" | "PAID";
  pricePerHour: number | null;
  verificationStatus: "PENDING" | "ACTIVE" | "REJECTED";
  active: boolean;
}

export interface TutorOwnProfileResponse {
  userId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  career: string;
  dni: string | null;
  institutionalId: string | null;
  profilePictureUrl: string | null;
  address: string | null;
  mercadoPagoLinked: boolean;
  averageRating: number | null;
  biography: string | null;
  subjects: TutorOwnSubject[];
  hasStudentProfile: boolean;
}
