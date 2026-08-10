import { useCareers } from "@/modules/tutors/hooks/use-careers";
import { useBasicSubjects } from "@/modules/tutors/hooks/use-basic-subjects";
import { useCareerSubjects } from "@/modules/tutors/hooks/use-career-subjects";
import { useMyTutorProfile } from "../../hooks/Usemytutorprofile";

/**
 * Materias básicas y de la carrera propia, excluyendo las que el tutor
 * ya tiene cargadas como Tutor_Subject (evita duplicados / 409).
 */
export function useAvailableSubjects() {
  const { data: profile, isLoading: profileLoading } = useMyTutorProfile();
  const { data: careers, isLoading: careersLoading } = useCareers();

  function normalizeName(name: string) {
    return name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim()
      .toLowerCase();
  }

  const ownCareer = careers?.find(
    (c) => normalizeName(c.name) === normalizeName(profile?.career ?? "")
  );

  const { data: basicSubjects, isLoading: basicLoading } = useBasicSubjects();
  const { data: careerSubjects, isLoading: careerLoading } = useCareerSubjects(ownCareer?.careerId);

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

  const isLoading = profileLoading || careersLoading || basicLoading || careerLoading;

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
