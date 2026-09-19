import type {
  TutorProfile,
  TutorSubjectRate,
  TutorReview,
  TutorMaterialItem,
  RawModality,
} from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import type {
  TutorMaterialAccessApiResponse,
  TutorMaterialApiResponse,
  TutorProfileApiResponse,
} from "@/modules/student/tutorProfile/interfaces/responses/tutor-api.types";
import { httpClient } from "@/shared/lib/httpClient";

const normalizeModality = (modality: string): TutorSubjectRate["modalities"] => {
  if (modality === "BOTH") return ["Virtual", "Presencial"];
  if (modality === "IN_PERSON") return ["Presencial"];
  return ["Virtual"];
};

const isSubjectVerified = (
  verificationStatus: string | null | undefined,
  profileVerified: boolean
) => {
  if (!verificationStatus) return profileVerified;
  return verificationStatus === "ACTIVE";
};

const inferFileType = (format: string, fileName: string | null): TutorMaterialItem["fileType"] => {
  const normalizedSource = `${format}.${fileName ?? ""}`.toUpperCase();

  if (normalizedSource.includes(".XLSX") || normalizedSource.includes(".XLS")) {
    return "XLSX";
  }

  if (
    normalizedSource.includes(".PNG") ||
    normalizedSource.includes(".JPG") ||
    normalizedSource.includes(".JPEG") ||
    normalizedSource.includes(".WEBP")
  ) {
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

const bytesToMegabytes = (sizeInBytes: number | null) =>
  sizeInBytes ? sizeInBytes / (1024 * 1024) : 0;

export const mapTutorMaterials = (materials: TutorMaterialApiResponse[]): TutorMaterialItem[] =>
  materials.map((material) => ({
    id: material.id,
    title: material.name,
    subject: material.subjectName,
    fileUrl: material.downloadUrl ?? "",
    fileType: inferFileType(material.format, material.originalFileName),
    fileSizeMB: bytesToMegabytes(material.sizeInBytes),
  }));

function mapTutorProfile(api: TutorProfileApiResponse): TutorProfile {
  const subjects = api.subjects ?? [];
  const reviewsApi = api.reviews ?? [];

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
    modalities: normalizeModality(m.modality),
    rawModality: m.modality as RawModality,

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

  return {
    id: api.id,
    name: api.fullName,
    avatarUrl: api.profilePictureUrl ?? null,
    rating: api.averageRating ?? 0,
    address: api.address ?? null, 
    reviewsCount: reviewsApi.length,
    subjects: subjects.map((m) => m.subjectName),
    about: api.biography ?? "",
    subjectRates,
    reviews,
    material: [],
    hasConfirmedBooking: false,
  };
}

export const getTutorProfile = async (tutorId: string): Promise<TutorProfile> => {
  const { data } = await httpClient.get<TutorProfileApiResponse>(
    `/api/v1/tutors/${tutorId}/profile`
  );
  return mapTutorProfile(data);
};

export const checkTutorMaterialAccess = async (tutorId: string): Promise<boolean> => {
  const { data } = await httpClient.get<{ accesoHabilitado: boolean }>(
    `/api/v1/materials/tutores/${tutorId}/acceso`
  );
  return data.accesoHabilitado;
};

export const getAccessibleTutorMaterials = async (
  tutorId: string
): Promise<TutorMaterialApiResponse[]> => {
  const { data } = await httpClient.get<TutorMaterialApiResponse[]>(
    `/api/v1/materials/tutores/${tutorId}/materiales`
  );
  return data;
};

export const getMaterialDownloadUrl = async (materialId: string): Promise<string> => {
  const { data } = await httpClient.get<string>(`/api/v1/materials/${materialId}/download`);
  return data;
};
