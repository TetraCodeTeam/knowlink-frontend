import { useBasicSubjects } from "@/modules/tutors/hooks/useBasicSubjects";
import { useCareerSubjects } from "@/modules/tutors/hooks/useCareerSubjects";
import { useMyTutorProfile } from "@/modules/tutor/hooks/useMyTutorProfile";

/**
 * Materias básicas y de la carrera propia, excluyendo las que el tutor
 * ya tiene cargadas como Tutor_Subject (evita duplicados / 409).
 *
 * La carrera y la institución se resuelven por sus ids en el perfil: con dos
 * instituciones que comparten el nombre de una carrera, buscar por nombre sería
 * ambiguo.
 */
export function useAvailableSubjects() {
  const { data: profile, isLoading: profileLoading } = useMyTutorProfile();

  function normalizeName(name: string) {
    return name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim()
      .toLowerCase();
  }

  const { data: basicSubjects, isLoading: basicLoading } = useBasicSubjects(profile?.institutionId);
  const { data: careerSubjects, isLoading: careerLoading } = useCareerSubjects(profile?.careerId);

  const existingSubjectIds = profile?.subjects
    ?.map((ts) => {
      const allOptions = [...(basicSubjects ?? []), ...(careerSubjects ?? [])];

      return allOptions.find((opt) => normalizeName(opt.name) === normalizeName(ts.subjectName))
        ?.subjectId;
    })
    .filter((id): id is string => Boolean(id));

  const availableBasicSubjects = basicSubjects?.filter(
    (s) => !existingSubjectIds?.includes(s.subjectId)
  );

  const availableCareerSubjects = careerSubjects?.filter(
    (s) => !existingSubjectIds?.includes(s.subjectId)
  );

  const isLoading = profileLoading || basicLoading || careerLoading;

  const hasAvailableSubjects =
    !!availableBasicSubjects?.length || !!availableCareerSubjects?.length;

  return {
    profile,
    basicSubjects: availableBasicSubjects,
    careerSubjects: availableCareerSubjects,
    basicLoading,
    careerLoading,
    isLoading,
    hasAvailableSubjects,
  };
}
