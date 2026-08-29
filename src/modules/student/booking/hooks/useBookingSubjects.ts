// Hook que trae las materias reservables de un tutor específico, a partir
// de su perfil público real (no más mock).
import { useQuery } from "@tanstack/react-query";
import type { BookingSubject } from "@/modules/student/booking/interfaces/bookingSubjectType";
import type { Modality } from "@/modules/student/booking/constants/modality.constants";
import type { RawModality } from "@/modules/tutor/interfaces/tutor.interface";
import { getTutorProfile } from "@/modules/tutor/api/getTutorProfile";

function toAvailableModalities(raw: RawModality): Modality[] {
  if (raw === "BOTH") return ["VIRTUAL", "IN_PERSON"];
  if (raw === "IN_PERSON") return ["IN_PERSON"];
  return ["VIRTUAL"];
}

export function useBookingSubjects(tutorId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["tutor-profile", tutorId],
    queryFn: () => getTutorProfile(tutorId),
    enabled: Boolean(tutorId),
  });

  const subjects: BookingSubject[] =
    data?.subjectRates.map((subject) => ({
      id: subject.id, // ya es el tutorSubjectId real
      name: subject.name,
      hourlyRate: subject.price,
      availableModalities: toAvailableModalities(subject.rawModality),
      address: subject.rawModality !== "VIRTUAL" ? (data.address ?? undefined) : undefined,
    })) ?? [];

  return { subjects, isLoading };
}