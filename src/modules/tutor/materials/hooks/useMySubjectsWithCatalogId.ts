import { useBasicSubjects } from "@/modules/tutors/hooks/useBasicSubjects";
import { useCareerSubjects } from "@/modules/tutors/hooks/useCareerSubjects";
import { useMyTutorProfile } from "@/modules/tutor/profile/hooks/useMyTutorProfile";

export interface SubjectWithCatalogId {
  tutorSubjectId: string;
  subjectName: string;
  catalogSubjectId: string;
}

function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

/**
 * Cross-references the tutor's own subjects (which only carry tutorSubjectId + subjectName)
 * against the catalog (basic + career subjects of the tutor's own institution and career)
 * to resolve the real catalog subjectId. That catalog subjectId is what the materials API
 * expects as the `subjectId` param.
 */
export function useMySubjectsWithCatalogId() {
  const { data: profile, isLoading: profileLoading } = useMyTutorProfile();
  const { data: basicSubjects, isLoading: basicLoading } = useBasicSubjects(profile?.institutionId);
  const { data: careerSubjects, isLoading: careerLoading } = useCareerSubjects(profile?.careerId);

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

  const isLoading = profileLoading || basicLoading || careerLoading;

  return { subjects, isLoading };
}
