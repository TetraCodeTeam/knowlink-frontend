import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolvePost } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

export function useResolvePost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postId: string) => resolvePost(postId),
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.myPostsBase });
      toast.success("Marcaste tu consulta como resuelta.");
    },
  });

  return { resolvePost: mutation.mutateAsync, isPending: mutation.isPending };
}
