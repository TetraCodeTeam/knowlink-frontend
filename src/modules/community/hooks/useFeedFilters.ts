import { useCallback, useState } from "react";
import {
  CLEARED_FEED_FILTERS,
  DEFAULT_FEED_FILTERS,
} from "@/modules/community/constants/feed-filters.constants";
import type {
  FeedFilters,
  FeedFiltersDraft,
} from "@/modules/community/interfaces/feed-filters.interface";
import type { PostType } from "@/modules/community/types/post-type.type";
import { countActiveFilters } from "@/modules/community/utils/count-active-filters";

/** Filtros aplicados del feed. El borrador de edición vive en el panel y llega acá con "Aplicar". */
export function useFeedFilters() {
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FEED_FILTERS);

  const setType = useCallback((type: PostType | null) => {
    setFilters((current) => ({ ...current, type }));
  }, []);

  const applyDraft = useCallback((draft: FeedFiltersDraft) => {
    setFilters((current) => ({ ...draft, type: current.type }));
  }, []);

  const clear = useCallback(() => setFilters(CLEARED_FEED_FILTERS), []);

  return { filters, activeCount: countActiveFilters(filters), setType, applyDraft, clear };
}
