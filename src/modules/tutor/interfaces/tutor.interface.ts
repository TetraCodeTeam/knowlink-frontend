export type Modalidad = "Presencial" | "Virtual";

export interface TutorSubjectRate {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree: boolean;
  modalities: Modalidad[];
  isVerified: boolean;
}

export interface TutorReview {
  id: string;
  studentName: string;
  studentAvatarUrl: string | null;
  subject: string;
  rating: number;
  comment: string;
}

export interface TutorMaterialItem {
  id: string;
  title: string;
  subject: string;
  fileUrl: string;
}

export interface TutorProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  reviewsCount: number;
  subjects: string[];
  about: string;
  subjectRates: TutorSubjectRate[];
  reviews: TutorReview[];
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
}