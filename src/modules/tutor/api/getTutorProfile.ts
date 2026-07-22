import type { TutorProfile, TutorSubjectRate, TutorReview, TutorMaterialItem } from "@/modules/tutor/interfaces/tutor.interface";
import type { TutorProfileApiResponse } from "@/modules/tutor/interfaces/tutor-api.types";
import { httpClient } from "@/shared/lib/httpClient";

const normalizeModality = (modality: string): TutorSubjectRate["modalities"][number] => {
  if (modality === "IN_PERSON") return "Presencial";
  return "Virtual";
};

const isSubjectVerified = (verificationStatus: string | null | undefined, profileVerified: boolean) => {
  if (!verificationStatus) return profileVerified;
  return verificationStatus === "ACTIVE";
};

const MATERIAL_FALLBACK_SUBJECT = "Material general";

const inferFileType = (name: string, fileUrl: string): TutorMaterialItem["fileType"] => {
  const normalizedSource = `${name}.${fileUrl}`.toUpperCase();

  if (normalizedSource.includes(".XLSX") || normalizedSource.includes(".XLS")) {
    return "XLSX";
  }

  if (normalizedSource.includes(".PNG") || normalizedSource.includes(".JPG") || normalizedSource.includes(".JPEG") || normalizedSource.includes(".WEBP")) {
    return "PNG";
  }

  if (normalizedSource.includes(".DOCX") || normalizedSource.includes(".DOC")) {
    return "DOCX";
  }

  if (normalizedSource.includes(".PPTX") || normalizedSource.includes(".PPT")) {
    return "PPTX";
  }

  return "PDF";
};

function mapTutorProfile(api: TutorProfileApiResponse): TutorProfile {
  const subjects = api.subjects ?? [];
  const reviewsApi = api.reviews ?? [];
  const materialsApi = api.materials ?? [];

  const reviewsBySubject = reviewsApi.reduce<Record<string, number>>((acc, review) => {
    const key = review.subjectName?.trim();
    if (!key) return acc;

    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const subjectRates: TutorSubjectRate[] = subjects.map((m, i) => ({
    id: m.tutorSubjectId ?? `${m.subjectName}-${i}`,
    name: m.subjectName,
    rating: m.averageRating ?? api.averageRating ?? 0,
    reviewsCount: m.reviewCount ?? reviewsBySubject[m.subjectName] ?? reviewsApi.length,
    price: m.pricePerHour ?? 0,
    isFree: m.compensationType === "FREE" || !m.pricePerHour,
    modalities: [normalizeModality(m.modality)] as TutorSubjectRate["modalities"],
    isVerified: isSubjectVerified(m.verificationStatus, api.verified),
  }));

  const reviews: TutorReview[] = reviewsApi.map((r, i) => ({
    id: `review-${i}`,
    studentName: "Alumno",
    studentAvatarUrl: null,
    subject: r.subjectName ?? "",
    rating: r.score,
    comment: r.comment ?? "",
  }));

  const material: TutorMaterialItem[] = materialsApi.map((m, i) => ({
    id: `material-${i}`,
    title: m.name,
    subject: MATERIAL_FALLBACK_SUBJECT,
    fileUrl: m.fileUrl,
    fileType: inferFileType(m.name, m.fileUrl),
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