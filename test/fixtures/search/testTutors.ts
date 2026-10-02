import type {
  SubjectSummary,
  TutorSearchResult,
} from "@/modules/student/interfaces/tutor-search-result.interface";

export const engineeringSubjects: SubjectSummary[] = [
  { name: "Álgebra", career: "Ingeniería en Sistemas" },
  { name: "Física", career: "Ingeniería en Sistemas" },
];

export const tutorAna: TutorSearchResult = {
  tutorId: "t1",
  fullName: "Ana García",
  photoProfile: null,
  averageRating: 4.5,
  totalReviews: 2,
  subjects: [{ name: "Álgebra", career: "Ingeniería en Sistemas" }],
};

export const tutorCarlos: TutorSearchResult = {
  tutorId: "t2",
  fullName: "Carlos López",
  photoProfile: null,
  averageRating: null,
  totalReviews: 0,
  subjects: [{ name: "Física", career: "Ingeniería en Sistemas" }],
};

export const testTutors: TutorSearchResult[] = [tutorAna, tutorCarlos];
