import { useCallback, useEffect, useState } from "react";
import {
  CLEARED_FEED_FILTERS,
  DEFAULT_FEED_FILTERS,
} from "@/modules/community/constants/feed-filters.constants";
import { useFeedSessionStore } from "@/modules/community/hooks/useFeedSessionStore";
import type {
  FeedFilters,
  FeedFiltersDraft,
} from "@/modules/community/interfaces/feed-filters.interface";
import type { PostType } from "@/modules/community/types/post-type.type";
import { countActiveFilters } from "@/modules/community/utils/count-active-filters";

/**
 * Filtros aplicados del feed. El borrador de edición vive en el panel y llega acá con "Aplicar".
 *
 * Con `restore` (se vuelve al feed desde un hilo o con "atrás") arrancan con los últimos filtros que
 * había, en lugar de los de por defecto: quien limpió los filtros no tiene que volver a limpiarlos.
 */
export function useFeedFilters(restore: boolean) {
  const [filters, setFilters] = useState<FeedFilters>(
    () => (restore ? useFeedSessionStore.getState().filters : null) ?? DEFAULT_FEED_FILTERS
  );

  // Una visita nueva al feed no hereda nada de la anterior.
  useEffect(() => {
    if (!restore) useFeedSessionStore.getState().reset();
  }, [restore]);

  useEffect(() => {
    useFeedSessionStore.getState().setFilters(filters);
  }, [filters]);

  const setType = useCallback((type: PostType | null) => {
    setFilters((current) => ({ ...current, type }));
  }, []);

  const applyDraft = useCallback((draft: FeedFiltersDraft) => {
    setFilters((current) => ({ ...draft, type: current.type }));
  }, []);

  const clear = useCallback(() => setFilters(CLEARED_FEED_FILTERS), []);

  return { filters, activeCount: countActiveFilters(filters), setType, applyDraft, clear };
}
