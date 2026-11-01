import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePost } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { UpdatePostRequest } from "@/modules/community/interfaces/requests/update-post.interface";

export function useUpdatePost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      postId,
      request,
      file,
    }: {
      postId: string;
      request: UpdatePostRequest;
      file: File | null;
    }) => updatePost(postId, request, file),
    onSuccess: (_data, { postId }) => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.myPostsBase });
      toast.success("Publicación actualizada.");
    },
  });

  return { updatePost: mutation.mutateAsync, isPending: mutation.isPending };
}
