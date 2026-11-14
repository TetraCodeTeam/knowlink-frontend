import { useEffect, useRef } from "react";
import { useFeedSessionStore } from "@/modules/community/hooks/useFeedSessionStore";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import { feedPostDomId } from "@/modules/community/utils/feed-post-dom-id";

/** Páginas extra que se piden como máximo para encontrar la publicación (si ya no está en caché). */
const MAX_EXTRA_PAGES = 10;

interface RestoreFeedPositionOptions {
  /** Se vuelve al feed desde un hilo: hay que llevar la pantalla a la publicación donde se quedó. */
  restore: boolean;
  isLoading: boolean;
  posts: CommunityPost[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}

/**
 * Al volver de un hilo lleva la pantalla a la publicación que se abrió, en vez de dejarla arriba de todo.
 * Si esa publicación todavía no está cargada (la caché venció), pide páginas hasta encontrarla.
 */
export function useRestoreFeedPosition({
  restore,
  isLoading,
  posts,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: RestoreFeedPositionOptions) {
  // Se lee una sola vez, al montar: es la publicación del hilo del que se vuelve.
  const anchorRef = useRef<string | null>(
    restore ? useFeedSessionStore.getState().anchorPostId : null
  );
  const extraPagesRequested = useRef(0);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || isLoading) return;

    const element = document.getElementById(feedPostDomId(anchor));
    if (element) {
      element.scrollIntoView({ block: "start", behavior: "instant" });
      anchorRef.current = null;
      useFeedSessionStore.getState().setAnchorPostId(null);
      return;
    }

    if (isFetchingNextPage) return;

    if (hasNextPage && extraPagesRequested.current < MAX_EXTRA_PAGES) {
      extraPagesRequested.current += 1;
      void fetchNextPage();
      return;
    }

    // No apareció (fue eliminada o ya no coincide con los filtros): el feed queda arriba.
    anchorRef.current = null;
    useFeedSessionStore.getState().setAnchorPostId(null);
  }, [posts, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);
}
