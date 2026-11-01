import { useQuery } from "@tanstack/react-query";
import { getCommunitySubjects } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

const SUBJECTS_STALE_TIME_MS = 1000 * 60 * 30;

/** Sin `careerId` devuelve todo el catálogo; con él, las materias de esa carrera más las básicas. */
export function useCommunitySubjects(enabled = true, careerId: string | null = null) {
  const query = useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.subjectsByCareer(careerId),
    queryFn: () => getCommunitySubjects(careerId),
    enabled,
    staleTime: SUBJECTS_STALE_TIME_MS,
  });

  return { subjects: query.data ?? [], isLoading: query.isLoading };
}
