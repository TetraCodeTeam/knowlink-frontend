export interface TutorSubjectResponse {
  tutorSubjectId: string;
  subjectName: string;
  modality: "VIRTUAL" | "IN_PERSON" | "BOTH";
  compensationType: "FREE" | "PAID";
  pricePerHour: number | null;
  /** Estado de validación (US-25). No indica si la materia está activa o desactivada. */
  verificationStatus: "PENDING" | "ACTIVE" | "REJECTED";
  averageRating: number | null;
  reviewCount: number | null;
  /** true = ofrecida; false = desactivada por el tutor. */
  active: boolean;
}
