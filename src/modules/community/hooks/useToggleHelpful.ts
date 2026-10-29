import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReplyHelpful, unmarkReplyHelpful } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

/** Alterna la marca "Esto me sirvió": si ya la marqué, la quita. */
export function useToggleHelpful(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ replyId, markedByMe }: { replyId: string; markedByMe: boolean }) =>
      markedByMe ? unmarkReplyHelpful(postId, replyId) : markReplyHelpful(postId, replyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
    },
  });

  return {
    toggleHelpful: mutation.mutateAsync,
    isPending: mutation.isPending,
    pendingReplyId: mutation.isPending ? mutation.variables?.replyId : undefined,
  };
}
