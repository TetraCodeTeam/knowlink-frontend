import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddStudentClaimComment } from "@/modules/student/support/hooks/useStudentSupportDetailMutations";
import {
  claimCommentSchema,
  type ClaimCommentFormValues,
} from "@/modules/support/schemas/claimComment.schema";

export function useStudentClaimCommentForm(claimId: string) {
  const [isEditing, setIsEditing] = useState(false);
  const mutation = useAddStudentClaimComment(claimId);
  const form = useForm<ClaimCommentFormValues>({
    resolver: zodResolver(claimCommentSchema),
    defaultValues: { comment: "" },
  });

  const closeEditor = () => {
    setIsEditing(false);
    form.reset();
  };

  const submit = form.handleSubmit(({ comment }) => {
    mutation.mutate(comment, { onSuccess: closeEditor });
  });

  return {
    form,
    isEditing,
    isPending: mutation.isPending,
    openEditor: () => setIsEditing(true),
    closeEditor,
    submit,
  };
}
