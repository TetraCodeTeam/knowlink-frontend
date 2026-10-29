import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPost } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { CreatePostFormData } from "@/modules/community/schemas/create-post.schema";

export function useCreatePost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePostFormData) =>
      createPost(
        {
          type: data.type,
          subjectId: data.subjectId,
          title: data.title.trim(),
          content: data.content.trim(),
        },
        data.file
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.myPostsBase });
      toast.success("Tu publicación ya está visible en la comunidad.");
    },
  });

  return { createPost: mutation.mutateAsync, isPending: mutation.isPending };
}
