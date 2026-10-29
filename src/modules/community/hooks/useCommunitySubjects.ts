import { useQuery } from "@tanstack/react-query";
import { getCommunitySubjects } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

const SUBJECTS_STALE_TIME_MS = 1000 * 60 * 30;

export function useCommunitySubjects(enabled = true) {
  const query = useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.subjects,
    queryFn: getCommunitySubjects,
    enabled,
    staleTime: SUBJECTS_STALE_TIME_MS,
  });

  return { subjects: query.data ?? [], isLoading: query.isLoading };
}
