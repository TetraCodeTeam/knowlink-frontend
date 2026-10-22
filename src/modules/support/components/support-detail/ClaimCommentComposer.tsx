import { Box, Button, TextField } from "@mui/material";
import { MessageSquarePlus } from "lucide-react";
import { MAX_CLAIM_COMMENT_LENGTH } from "@/modules/support/constants/support.constants";
import { useClaimCommentForm } from "@/modules/support/hooks/useClaimCommentForm";
import {
  composerActionsSx,
  composerCancelButtonSx,
  composerContainerSx,
  composerOpenButtonSx,
  composerSubmitButtonSx,
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
            <Button
              size="small"
              onClick={closeEditor}
              disabled={isPending}
              sx={composerCancelButtonSx}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="small"
              variant="contained"
              disabled={!commentLength || isPending}
              sx={composerSubmitButtonSx}
            >
              {isPending ? "Enviando..." : "Enviar comentario"}
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          fullWidth
          variant="contained"
          startIcon={<MessageSquarePlus size={16} />}
          onClick={openEditor}
          sx={composerOpenButtonSx}
        >
          Aportar comentario
        </Button>
      )}
    </Box>
  );
}
