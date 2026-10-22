import { useEffect, useState, type ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { ClaimEligibility, ClaimReason } from "@/modules/class-history/api/claims.api";
import { useCreateClaim } from "@/modules/class-history/hooks/useCreateClaim";

interface CreateClaimDialogProps {
  open: boolean;
  bookingId: string;
  eligibility: ClaimEligibility;
  onClose: () => void;
}

const REASON_LABELS: Record<ClaimReason, string> = {
  STUDENT_COULD_NOT_ATTEND: "El alumno no pudo asistir a la sesión",
  TUTOR_COULD_NOT_ATTEND: "El tutor no pudo asistir a la sesión",
  I_COULD_NOT_ATTEND: "No pude asistir a la sesión",
};

export default function CreateClaimDialog({
  open,
  bookingId,
  eligibility,
  onClose,
}: CreateClaimDialogProps) {
  const [reason, setReason] = useState<ClaimReason | "">(eligibility.allowedReasons[0] ?? "");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState("");
  const createClaimMutation = useCreateClaim(bookingId);
  const resetCreateClaim = createClaimMutation.reset;

  useEffect(() => {
    if (open) {
      setReason(eligibility.allowedReasons[0] ?? "");
      setComment("");
      setFiles([]);
      setFilesError("");
      resetCreateClaim();
    }
  }, [open, eligibility.allowedReasons, resetCreateClaim]);

  const handleSubmit = async () => {
    if (!reason) return;
    try {
      await createClaimMutation.mutateAsync({ reason, comment: comment.trim(), files });
      onClose();
    } catch {
      // The HTTP interceptor displays the backend error and the dialog stays open for correction.
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length > 3) {
      setFilesError("Podés adjuntar hasta 3 archivos.");
      setFiles([]);
      event.target.value = "";
      return;
    }
    const invalidFile = selectedFiles.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return (
        !["pdf", "jpg", "jpeg", "png"].includes(extension ?? "") || file.size > 5 * 1024 * 1024
      );
    });
    if (invalidFile) {
      setFilesError("Los archivos deben ser PDF, JPG o PNG y no superar 5 MB cada uno.");
      setFiles([]);
      event.target.value = "";
      return;
    }
    setFilesError("");
    setFiles(selectedFiles);
  };

  return (
    <Dialog
      open={open}
      onClose={createClaimMutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Iniciar un reclamo</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}
      >
        <Typography color="text.secondary">
          Contanos qué ocurrió en esta sesión. El reclamo será revisado por el equipo de soporte.
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="claim-reason-label">Motivo</InputLabel>
          <Select
            labelId="claim-reason-label"
            value={reason}
            label="Motivo"
            onChange={(event) => setReason(event.target.value as ClaimReason)}
          >
            {eligibility.allowedReasons.map((allowedReason) => (
              <MenuItem key={allowedReason} value={allowedReason}>
                {REASON_LABELS[allowedReason]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Descripción (opcional)"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          multiline
          minRows={3}
          inputProps={{ maxLength: 500 }}
          helperText={`${comment.length}/500`}
        />
        <Button component="label" variant="outlined" disabled={createClaimMutation.isPending}>
          Adjuntar evidencia (hasta 3 archivos)
          <input
            hidden
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </Button>
        {filesError && <FormHelperText error>{filesError}</FormHelperText>}
        {files.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {files.map((file) => file.name).join(", ")}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={createClaimMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!reason || createClaimMutation.isPending}
        >
          {createClaimMutation.isPending ? "Enviando..." : "Enviar reclamo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
