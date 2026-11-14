import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { markPostHelpful, unmarkPostHelpful } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import type { CommunityPostDetail } from "@/modules/community/interfaces/responses/community-post-detail.interface";
import type { PagedPosts } from "@/modules/community/interfaces/responses/paged-posts.interface";
import type { PostHelpfulMark } from "@/modules/community/interfaces/responses/post-helpful-mark.interface";

const applyMark =
  (mark: PostHelpfulMark) =>
  (post: CommunityPost): CommunityPost =>
    post.postId === mark.postId
      ? { ...post, helpfulCount: mark.helpfulCount, markedHelpfulByMe: mark.markedByMe }
      : post;

/**
 * Alterna "Esto me sirvió" en un aporte. Con la respuesta del servidor actualiza esa publicación en la caché
 * (feed e hilo) en lugar de recargar el feed completo: así no se repiten las páginas ya cargadas ni se mueve la pantalla.
 */
export function useTogglePostHelpful() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ postId, markedByMe }: { postId: string; markedByMe: boolean }) =>
      markedByMe ? unmarkPostHelpful(postId) : markPostHelpful(postId),
    onSuccess: (mark) => {
      const update = applyMark(mark);

      queryClient.setQueriesData<InfiniteData<PagedPosts>>(
        { queryKey: [...COMMUNITY_QUERY_KEYS.feed, "list"] },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({ ...page, content: page.content.map(update) })),
          }
      );
      queryClient.setQueryData<CommunityPostDetail>(
        COMMUNITY_QUERY_KEYS.post(mark.postId),
        (detail) => detail && { ...detail, post: update(detail.post) }
      );
      // "Mis publicaciones" se vuelve a pedir la próxima vez que se abra.
      void queryClient.invalidateQueries({
        queryKey: COMMUNITY_QUERY_KEYS.myPostsBase,
        refetchType: "none",
      });
    },
  });

  return { toggleHelpful: mutation.mutateAsync, isPending: mutation.isPending };
}
