export type Modality = "Presencial" | "Virtual";
export type RawModality = "VIRTUAL" | "IN_PERSON" | "BOTH";

export interface TutorSubjectRate {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree: boolean;
  modalities: Modality[];
  rawModality: RawModality;
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
  address: string | null;
  subjectRates: TutorSubjectRate[];
  reviews: TutorReview[];
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
}