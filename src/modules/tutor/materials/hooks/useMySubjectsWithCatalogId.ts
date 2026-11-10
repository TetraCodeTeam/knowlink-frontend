import { useCommunitySubjects } from "@/modules/community/hooks/useCommunitySubjects";
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
 * against the catalog to resolve the real catalog subjectId. That catalog subjectId is what
 * the materials API expects as the `subjectId` param.
 *
 * The catalog combines three sources so no subject is dropped silently: the shared (basic)
 * subjects of the institution, the subjects of the tutor's own career, and the full
 * institution catalog behind GET /api/v1/community/subjects, which also covers subjects
 * whose row belongs to another career of the same institution. The exact name match is
 * tried first: subject names are unique per institution, so it always resolves the row the
 * tutor subject is linked to.
 */
export function useMySubjectsWithCatalogId() {
  const { data: profile, isLoading: profileLoading } = useMyTutorProfile();
  const { data: basicSubjects, isLoading: basicLoading } = useBasicSubjects(profile?.institutionId);
  const { data: careerSubjects, isLoading: careerLoading } = useCareerSubjects(profile?.careerId);
  const { subjects: institutionSubjects, isLoading: institutionLoading } = useCommunitySubjects();

  const allCatalogSubjects = [
    ...(basicSubjects ?? []),
    ...(careerSubjects ?? []),
    ...institutionSubjects,
  ];

  const subjects: SubjectWithCatalogId[] = (profile?.subjects ?? [])
    .map((ts) => {
      const match =
        allCatalogSubjects.find((opt) => opt.name === ts.subjectName) ??
        allCatalogSubjects.find((opt) => normalizeName(opt.name) === normalizeName(ts.subjectName));
      if (!match) return null;
      return {
        tutorSubjectId: ts.tutorSubjectId,
        subjectName: ts.subjectName,
        catalogSubjectId: match.subjectId,
      };
    })
    .filter((s): s is SubjectWithCatalogId => s !== null);

  const isLoading = profileLoading || basicLoading || careerLoading || institutionLoading;

  return { subjects, isLoading };
}
