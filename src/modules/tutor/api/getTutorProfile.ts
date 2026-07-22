import type { TutorProfile, TutorSubjectRate, TutorReview, TutorMaterialItem } from "@/modules/tutor/interfaces/tutor.interface";
import type { TutorProfileApiResponse } from "@/modules/tutor/interfaces/tutor-api.types";
import { httpClient } from "@/shared/lib/httpClient";

const normalizeModality = (modality: string): TutorSubjectRate["modalities"][number] => {
  if (modality === "IN_PERSON") return "Presencial";
  return "Virtual";
};

function mapTutorProfile(api: TutorProfileApiResponse): TutorProfile {
  const subjects = api.subjects ?? [];
  const reviewsApi = api.reviews ?? [];
  const materialsApi = api.materials ?? [];

  const subjectRates: TutorSubjectRate[] = subjects.map((m, i) => ({
    id: m.tutorSubjectId ?? `${m.subjectName}-${i}`,
    name: m.subjectName,
    rating: m.averageRating ?? api.averageRating ?? 0,
    reviewsCount: m.reviewCount ?? reviewsApi.length,
    price: m.pricePerHour ?? 0,
    isFree: m.compensationType === "FREE" || !m.pricePerHour,
    modalities: [normalizeModality(m.modality)] as TutorSubjectRate["modalities"],
    isVerified: api.verified,
  }));

  const reviews: TutorReview[] = reviewsApi.map((r, i) => ({
    id: `review-${i}`,
    studentName: "Alumno",
    studentAvatarUrl: null,
    subject: "",
    rating: r.score,
    comment: r.comment ?? "",
  }));

  const material: TutorMaterialItem[] = materialsApi.map((m, i) => ({
    id: `material-${i}`,
    title: m.name,
    subject: "",
    fileUrl: m.fileUrl,
    fileType: "PDF",
    fileSizeMB: 0,
  }));

  return {
    id: api.id,
    name: api.fullName,
    avatarUrl: api.profilePictureUrl ?? null,
    rating: api.averageRating ?? 0,
    reviewsCount: reviewsApi.length,
    subjects: subjects.map((m) => m.subjectName),
    about: api.biography ?? "",
    subjectRates,
    reviews,
    material,
    hasConfirmedBooking: materialsApi.length > 0,
  };
}

export const getTutorProfile = async (tutorId: string): Promise<TutorProfile> => {
  const { data } = await httpClient.get<TutorProfileApiResponse>(`/api/v1/tutors/${tutorId}/profile`);
  return mapTutorProfile(data);
};