import { useQuery } from "@tanstack/react-query";
import { getCommunityCareers } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

const CAREERS_STALE_TIME_MS = 1000 * 60 * 30;

/** Carreras de la institución del usuario autenticado. */
export function useCommunityCareers() {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.careers,
    queryFn: getCommunityCareers,
    staleTime: CAREERS_STALE_TIME_MS,
  });
}
