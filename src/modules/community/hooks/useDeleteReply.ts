import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteReply } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

export function useDeleteReply(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (replyId: string) => deleteReply(postId, replyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.myPostsBase });
      toast.success("Respuesta eliminada.");
    },
  });

  return { deleteReply: mutation.mutateAsync, isPending: mutation.isPending };
}
