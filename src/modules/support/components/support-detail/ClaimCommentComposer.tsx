import { Box, TextField } from "@mui/material";
import { MessageSquarePlus } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { MAX_CLAIM_COMMENT_LENGTH } from "@/modules/support/constants/support.constants";
import { useClaimCommentForm } from "@/modules/support/hooks/useClaimCommentForm";
import {
  composerActionsSx,
  composerButtonSx,
  composerContainerSx,
  composerOpenButtonSx,
} from "@/modules/support/styles/claimCommentComposer.styles";

interface ClaimCommentComposerProps {
  claimId: string;
}

export function ClaimCommentComposer({ claimId }: ClaimCommentComposerProps) {
  const { form, isEditing, isPending, openEditor, closeEditor, submit } =
    useClaimCommentForm(claimId);
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const commentLength = watch("comment").length;

  return (
    <Box sx={composerContainerSx}>
      {isEditing ? (
        <Box component="form" onSubmit={submit}>
          <TextField
            {...register("comment")}
            fullWidth
            size="small"
            autoFocus
            placeholder="Escribí tu comentario..."
            multiline
            minRows={2}
            inputProps={{ maxLength: MAX_CLAIM_COMMENT_LENGTH }}
            error={!!errors.comment}
            helperText={errors.comment?.message ?? `${commentLength}/${MAX_CLAIM_COMMENT_LENGTH}`}
            disabled={isPending}
          />
          <Box sx={composerActionsSx}>
            <AppButton
              appVariant="outline"
              size="small"
              onClick={closeEditor}
              disabled={isPending}
              sx={composerButtonSx}
            >
              Cancelar
            </AppButton>
            <AppButton
              type="submit"
              size="small"
              disabled={!commentLength || isPending}
              sx={composerButtonSx}
            >
              {isPending ? "Enviando..." : "Enviar comentario"}
            </AppButton>
          </Box>
        </Box>
      ) : (
        <AppButton
          fullWidth
          startIcon={<MessageSquarePlus size={16} />}
          onClick={openEditor}
          sx={composerOpenButtonSx}
        >
          Aportar comentario
        </AppButton>
      )}
    </Box>
  );
}
