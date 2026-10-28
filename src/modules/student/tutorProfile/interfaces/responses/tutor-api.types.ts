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
  id: string;
  name: string;
  originalFileName: string | null;
  subjectId: string;
  subjectName: string;
  tutorId: string;
  tutorName: string;
  format: string;
  downloadUrl: string | null;
  uploadedAt: string;
  sizeInBytes: number | null;
  alreadyReported: boolean;
}

export interface TutorMaterialAccessApiResponse {
  accesoHabilitado: boolean;
}

export interface SubjectAverageApiResponse {
  subjectId: string;
  name: string;
  average: number | null;
  count: number;
}

export interface RatingCommentApiResponse {
  id: string;
  subjectId: string;
  subjectName: string;
  score: number;
  comment: string | null;
  ratingDate: string;
}

export interface PagedCommentsApiResponse {
  content: RatingCommentApiResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TutorRatingHistoryApiResponse {
  tutorId: string;
  averageRating: number | null;
  totalRatings: number;
  subjects: SubjectAverageApiResponse[];
  comments: PagedCommentsApiResponse;
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
