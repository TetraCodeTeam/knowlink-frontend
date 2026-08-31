export type Modalidad = "Presencial" | "Virtual";
export type RawModality = "VIRTUAL" | "IN_PERSON" | "BOTH";

export interface TutorSubjectRate {
  id: string; // ya es el tutorSubjectId real (ver mapTutorProfile)
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree: boolean;
  modalities: Modalidad[]; // para mostrar chips — no tocar, ya se usa en otro lado
  rawModality: RawModality; // 👈 nuevo — para lógica de negocio (booking)
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

export type FileType = "PDF" | "XLSX" | "PNG" | "DOCX" | "PPTX";

export interface TutorMaterialItem {
  id: string;
  title: string;
  subject: string;
  fileUrl: string;
  fileType: FileType;
  fileSizeMB: number;
}

export interface TutorProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  reviewsCount: number;
  subjects: string[];
  about: string;
  address: string | null; // 👈 nuevo
  subjectRates: TutorSubjectRate[];
  reviews: TutorReview[];
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
}
