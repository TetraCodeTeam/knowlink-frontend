import { useState, type FormEvent } from "react";
import { Box, Button, TextField } from "@mui/material";
import { MessageSquarePlus } from "lucide-react";
import { useAddTutorClaimComment } from "@/modules/support/hooks/useSupportDetailMutations";

export function ClaimCommentComposer({ claimId }: { claimId: string }) {
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const mutation = useAddTutorClaimComment(claimId);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = comment.trim();
    if (!message) return;

    mutation.mutate(message, {
      onSuccess: () => {
        setComment("");
        setIsEditing(false);
      },
    });
  };

  return (
    <Box sx={{ p: 1.5, pt: 1, borderTop: "1px solid #E9EAF0", bgcolor: "background.paper" }}>
      {isEditing ? (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            size="small"
            autoFocus
            placeholder="Escribí tu comentario..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            multiline
            minRows={2}
            inputProps={{ maxLength: 2000 }}
            helperText={`${comment.length}/2000`}
            disabled={mutation.isPending}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setIsEditing(false);
                setComment("");
              }}
              disabled={mutation.isPending}
              sx={{ textTransform: "none", fontSize: 14 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="small"
              variant="contained"
              disabled={!comment.trim() || mutation.isPending}
              sx={{ bgcolor: "#293E9D", textTransform: "none", fontSize: 14 }}
            >
              {mutation.isPending ? "Enviando..." : "Enviar comentario"}
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          fullWidth
          variant="contained"
          startIcon={<MessageSquarePlus size={16} />}
          onClick={() => setIsEditing(true)}
          sx={{ bgcolor: "#293E9D", borderRadius: 1.5, textTransform: "none", fontSize: 14 }}
        >
          Aportar comentario
        </Button>
      )}
    </Box>
  );
}
