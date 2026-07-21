import type { TutorProfile, TutorSubjectRate, TutorReview, TutorMaterialItem } from "@/modules/tutor/interfaces/tutor.interface";
import type { TutorProfileApiResponse } from "@/modules/tutor/interfaces/tutor-api.types";
import { httpClient } from "@/shared/lib/httpClient";

function mapTutorProfile(api: TutorProfileApiResponse): TutorProfile {
  const subjectRates: TutorSubjectRate[] = api.materias.map((m, i) => ({
    id: `${m.materia}-${i}`,
    name: m.materia,
    rating: api.calificacionPromedio ?? 0,
    reviewsCount: api.calificaciones.length,
    price: m.precio ?? 0,
    isFree: m.tipoCompensacion === "GRATUITA" || !m.precio,
    modalities: [m.modalidad] as TutorSubjectRate["modalities"],
    isVerified: api.verificado,
  }));

  const reviews: TutorReview[] = api.calificaciones.map((r, i) => ({
    id: `review-${i}`,
    studentName: "Alumno",
    studentAvatarUrl: null,
    subject: "",
    rating: r.puntuacion,
    comment: r.comentario ?? "",
  }));

  const material: TutorMaterialItem[] = api.materiales.map((m, i) => ({
    id: `material-${i}`,
    title: m.nome,
    subject: "",
    fileUrl: m.urlArchivo,
    fileType: "PDF",
    fileSizeMB: 0,
  }));

  return {
    id: api.id,
    name: api.nombreCompleto,
    avatarUrl: api.fotoPerfil ?? null,
    rating: api.calificacionPromedio ?? 0,
    reviewsCount: api.calificaciones.length,
    subjects: api.materias.map((m) => m.materia),
    about: api.biografia ?? "",
    subjectRates,
    reviews,
    material,
    hasConfirmedBooking: api.materiales.length > 0,
  };
}

export const getTutorProfile = async (tutorId: string): Promise<TutorProfile> => {
  const { data } = await httpClient.get<TutorProfileApiResponse>(`/api/v1/tutors/${tutorId}/profile`);
  return mapTutorProfile(data);
};