import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFeedCounts } from "@/modules/community/api/community.api";
import { COMMUNITY_STALE_TIME_MS } from "@/modules/community/constants/community.constants";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

/** Los conteos ignoran el tipo, así que cambiar de pestaña no dispara otra consulta. */
export function useFeedCounts(filters: FeedFilters) {
  const countsFilters: FeedFilters = { ...filters, type: null };
  const query = useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.feedCounts(countsFilters),
    queryFn: () => getFeedCounts(countsFilters),
    staleTime: COMMUNITY_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });

  return { counts: query.data ?? null };
}
