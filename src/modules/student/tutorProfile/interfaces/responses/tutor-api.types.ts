export interface TutorSubjectApiResponse {
  tutorSubjectId: string;
  subjectName: string;
  modality: string;
  compensationType: string;
  pricePerHour: number | null;
  verificationStatus: string;
  averageRating: number | null;
  reviewCount: number | null;
}

export interface TutorReviewApiResponse {
  score: number;
  comment: string | null;
  ratingDate: string; // ISO string from LocalDateTime
  subjectName?: string | null;
  subjectId?: string | null;
}

export interface TutorAvailabilityApiResponse {
  availabilityBlockId: string;
  date: string;
  startTime: string; // LocalTime string
  endTime: string;
  repeatWeekly: boolean;
}

export interface TutorMaterialApiResponse {
  name: string;
  fileUrl: string;
  uploadedAt: string; // ISO string from LocalDateTime
}

export interface TutorProfileApiResponse {
  id: string;
  fullName: string;
  biography: string | null;
  career: string | null;
  profilePictureUrl: string | null;
  address: string | null; // 👈 nuevo
  verified: boolean;
  averageRating: number | null;
  subjects: TutorSubjectApiResponse[];
  reviews: TutorReviewApiResponse[];
  availability: TutorAvailabilityApiResponse[];
  materials: TutorMaterialApiResponse[];
}
