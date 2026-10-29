import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReply } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { ReplyEdit } from "@/modules/community/interfaces/reply-edit.interface";

export function useUpdateReply(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ replyId, edit }: { replyId: string; edit: ReplyEdit }) =>
      updateReply(
        postId,
        replyId,
        { content: edit.content.trim(), removeAttachment: edit.removeAttachment },
        edit.file
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
      toast.success("Respuesta actualizada.");
    },
  });

  return { updateReply: mutation.mutateAsync, isPending: mutation.isPending };
}
