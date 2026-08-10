export interface TutorSubjectResponse {
  tutorSubjectId: string;
  subjectName: string;
  modality: string;
  compensationType: string;
  pricePerHour: number | null;
  verificationStatus: "PENDING" | "ACTIVE" | "REJECTED";
  averageRating: number | null;
  reviewCount: number | null;
}