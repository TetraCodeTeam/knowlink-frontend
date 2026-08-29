import { useCareers } from "@/modules/tutors/hooks/useCareers";
import { useBasicSubjects } from "@/modules/tutors/hooks/useBasicSubjects";
import { useCareerSubjects } from "@/modules/tutors/hooks/useCareerSubjects";
import { useMyTutorProfile } from "@/modules/tutor/profile/hooks/useMyTutorProfile";

export interface SubjectWithCatalogId {
  tutorSubjectId: string;
  subjectName: string;
  catalogSubjectId: string;
}

function normalizeName(name: string) {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

/**
 * Cross-references the tutor's own subjects (which only carry tutorSubjectId + subjectName)
 * against the catalog (basic + career subjects) to resolve the real catalog subjectId.
 * That catalog subjectId is what the materials API expects as the `subjectId` param.
 */
export function useMySubjectsWithCatalogId() {
  const { data: profile, isLoading: profileLoading } = useMyTutorProfile();
  const { data: careers, isLoading: careersLoading } = useCareers();

  const ownCareer = careers?.find(
    (c) => normalizeName(c.name) === normalizeName(profile?.career ?? "")
  );

  const { data: basicSubjects, isLoading: basicLoading } = useBasicSubjects();
  const { data: careerSubjects, isLoading: careerLoading } = useCareerSubjects(ownCareer?.careerId);

  const allCatalogSubjects = [...(basicSubjects ?? []), ...(careerSubjects ?? [])];

  const subjects: SubjectWithCatalogId[] = (profile?.subjects ?? [])
    .map((ts) => {
      const match = allCatalogSubjects.find(
        (opt) => normalizeName(opt.name) === normalizeName(ts.subjectName)
      );
      if (!match) return null;
      return {
        tutorSubjectId: ts.tutorSubjectId,
        subjectName: ts.subjectName,
        catalogSubjectId: match.subjectId,
      };
    })
    .filter((s): s is SubjectWithCatalogId => s !== null);

  const isLoading = profileLoading || careersLoading || basicLoading || careerLoading;

  return { subjects, isLoading };
}
