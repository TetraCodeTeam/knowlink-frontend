export type TutorModality = "VIRTUAL" | "IN_PERSON";

export interface TutorOwnSubject {
  tutorSubjectId: string;
  subjectName: string;
  averageRating: number | null;
  reviewCount: number | null;
  modality: TutorModality;
  compensationType: "FREE" | "PAID";
  pricePerHour: number | null;
  verificationStatus: string;
}

export interface TutorOwnProfileResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  career: string;
  profilePictureUrl: string | null;
  address: string | null;
  mercadoPagoLinked: boolean;
  averageRating: number | null;
  biography: string | null;
  subjects: TutorOwnSubject[];
}
