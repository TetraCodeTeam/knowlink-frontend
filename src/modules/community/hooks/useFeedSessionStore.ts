import { create } from "zustand";
import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

interface FeedSessionStore {
  /** Últimos filtros aplicados del feed. */
  filters: FeedFilters | null;
  /** Publicación cuyo hilo se abrió desde el feed: a ella se vuelve al regresar. */
  anchorPostId: string | null;
  setFilters: (filters: FeedFilters) => void;
  setAnchorPostId: (postId: string | null) => void;
  reset: () => void;
}

/**
 * Lo que hace falta para que el feed vuelva como estaba al regresar de un hilo: los filtros y la
 * publicación donde se quedó. Vive solo en memoria: se pierde al recargar y no se comparte entre pestañas.
 */
export const useFeedSessionStore = create<FeedSessionStore>()((set) => ({
  filters: null,
  anchorPostId: null,
  setFilters: (filters) => set({ filters }),
  setAnchorPostId: (anchorPostId) => set({ anchorPostId }),
  reset: () => set({ filters: null, anchorPostId: null }),
}));
