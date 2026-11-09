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
  /** Verificación derivada del promedio de calificaciones (opcional: backend viejo no lo envía). */
  verified?: boolean;
  /** true = ofrecida; false = desactivada por el tutor. */
  active: boolean;
}
