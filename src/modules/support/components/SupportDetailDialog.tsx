import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import {
  addTutorClaimComment,
  getMaterialReportingPolicy,
  getReportedMaterialDetail,
  getTutorClaimDetail,
  submitMaterialDefense,
} from "@/modules/support/api/support.api";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";
import { useState, type ChangeEvent } from "react";

type SupportDetailSelection =
  { type: "claim"; id: string } | { type: "material"; id: string } | null;

interface SupportDetailDialogProps {
  selection: SupportDetailSelection;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "150px minmax(0, 1fr)", gap: 1, py: 0.75 }}>
      <Typography fontWeight={600}>{label}</Typography>
      <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
    </Box>
  );
}

export function SupportDetailDialog({ selection, onClose }: SupportDetailDialogProps) {
  const [comment, setComment] = useState("");
  const [defenseDescription, setDefenseDescription] = useState("");
  const [defenseFiles, setDefenseFiles] = useState<File[]>([]);
  const [defenseFilesError, setDefenseFilesError] = useState("");
  const queryClient = useQueryClient();
  const showMessage = useSnackbarStore((store) => store.showMessage);
  const claimQuery = useQuery({
    queryKey: ["tutorSupport", "claimDetail", selection?.type === "claim" ? selection.id : null],
    queryFn: () => getTutorClaimDetail(selection!.id),
    enabled: selection?.type === "claim",
  });
  const materialQuery = useQuery({
    queryKey: [
      "tutorSupport",
      "materialDetail",
      selection?.type === "material" ? selection.id : null,
    ],
    queryFn: () => getReportedMaterialDetail(selection!.id),
    enabled: selection?.type === "material",
  });
  const policyQuery = useQuery({
    queryKey: ["tutorSupport", "materialPolicy"],
    queryFn: getMaterialReportingPolicy,
    enabled: selection?.type === "material",
  });
  const commentMutation = useMutation({
    mutationFn: ({ claimId, message }: { claimId: string; message: string }) =>
      addTutorClaimComment(claimId, message),
    onSuccess: async (_, variables) => {
      setComment("");
      showMessage("Comentario agregado al reclamo.", "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
        queryClient.invalidateQueries({
          queryKey: ["tutorSupport", "claimDetail", variables.claimId],
        }),
      ]);
    },
  });
  const defenseMutation = useMutation({
    mutationFn: ({
      materialId,
      description,
      files,
    }: {
      materialId: string;
      description: string;
      files: File[];
    }) => submitMaterialDefense(materialId, description, files),
    onSuccess: async (_, variables) => {
      setDefenseDescription("");
      setDefenseFiles([]);
      showMessage("Descargo presentado correctamente.", "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tutorSupport"] }),
        queryClient.invalidateQueries({
          queryKey: ["tutorSupport", "materialDetail", variables.materialId],
        }),
      ]);
    },
  });
  const isClaim = selection?.type === "claim";
  const isLoading = isClaim ? claimQuery.isLoading : materialQuery.isLoading;
  const isError = isClaim ? claimQuery.isError : materialQuery.isError;
  const claim = claimQuery.data;
  const material = materialQuery.data;
  const policy = policyQuery.data;

  const handleDefenseFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const maxAttachments = policy?.maxDefenseAttachments ?? 5;
    const maxSize = policy?.maxDefenseAttachmentSizeBytes ?? 10 * 1024 * 1024;
    const invalidFile = selectedFiles.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return !["pdf", "png", "xlsx"].includes(extension ?? "") || file.size > maxSize;
    });
    if (selectedFiles.length > maxAttachments) {
      setDefenseFilesError(`Podés adjuntar hasta ${maxAttachments} archivos.`);
      setDefenseFiles([]);
      event.target.value = "";
      return;
    }
    if (invalidFile) {
      setDefenseFilesError(
        "Los archivos deben ser PDF, PNG o XLSX y respetar el tamaño máximo permitido."
      );
      setDefenseFiles([]);
      event.target.value = "";
      return;
    }
    setDefenseFilesError("");
    setDefenseFiles(selectedFiles);
  };

  const handleClose = () => {
    setComment("");
    setDefenseDescription("");
    setDefenseFiles([]);
    setDefenseFilesError("");
    onClose();
  };

  return (
    <Dialog
      open={selection !== null}
      onClose={commentMutation.isPending || defenseMutation.isPending ? undefined : handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isClaim ? "Detalle del reclamo" : "Detalle del material denunciado"}
        <IconButton
          aria-label="Cerrar"
          onClick={handleClose}
          size="small"
          disabled={commentMutation.isPending || defenseMutation.isPending}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">
            No se pudo cargar el detalle. Cerrá e intentá de nuevo.
          </Typography>
        ) : isClaim && claim ? (
          <Box>
            <DetailRow label="Materia" value={claim.subjectName} />
            <DetailRow label="Alumno" value={claim.student.fullName} />
            <DetailRow label="Fecha de sesión" value={claim.sessionDate} />
            <DetailRow label="Estado" value={claim.status} />
            <DetailRow label="Motivo" value={claim.reason} />
            <DetailRow label="Descripción" value={claim.declaration} />
            <DetailRow
              label="Fondos protegidos"
              value={`${claim.funds.currency} ${claim.funds.protectedAmount}`}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Seguimiento
            </Typography>
            {claim.comments.length ? (
              claim.comments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 1.5 }}>
                  <Typography fontWeight={600}>
                    {comment.authorName} · {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>{comment.comment}</Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Todavía no hay comentarios.</Typography>
            )}
            {claim.attachments.map((attachment) => (
              <Typography key={attachment.id} component="div">
                <a href={attachment.signedUrl} target="_blank" rel="noreferrer">
                  {attachment.fileName}
                </a>
              </Typography>
            ))}
            {claim.status !== "RESOLVED" && (
              <Box
                component="form"
                sx={{ mt: 3 }}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (comment.trim()) {
                    commentMutation.mutate({ claimId: claim.claimId, message: comment.trim() });
                  }
                }}
              >
                <TextField
                  fullWidth
                  label="Agregar comentario"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  multiline
                  minRows={2}
                  inputProps={{ maxLength: 2000 }}
                  helperText={`${comment.length}/2000`}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1 }}
                  disabled={!comment.trim() || commentMutation.isPending}
                >
                  {commentMutation.isPending ? "Enviando..." : "Enviar comentario"}
                </Button>
              </Box>
            )}
          </Box>
        ) : material ? (
          <Box>
            <DetailRow label="Archivo" value={material.originalFileName} />
            <DetailRow label="Materia" value={material.subjectName} />
            <DetailRow label="Estado" value={material.status} />
            <DetailRow label="Disponible" value={material.available ? "Sí" : "No"} />
            <DetailRow label="Equipo revisor" value={material.reviewTeamName} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Denuncias ({material.reportCount})
            </Typography>
            {material.reports.map((report) => (
              <Box key={report.reportId} sx={{ mb: 1.5 }}>
                <Typography fontWeight={600}>
                  {report.reason} · {new Date(report.reportedAt).toLocaleDateString()}
                </Typography>
                <Typography>{report.description || "Sin descripción adicional."}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Descargo
            </Typography>
            {material.defense?.submitted ? (
              <>
                <Typography>{material.defense.description}</Typography>
                {material.defense.attachments.map((attachment) => (
                  <Typography key={attachment.attachmentId} component="div">
                    <a href={attachment.signedUrl} target="_blank" rel="noreferrer">
                      {attachment.fileName}
                    </a>
                  </Typography>
                ))}
              </>
            ) : (
              <>
                <Typography color="text.secondary">Todavía no presentaste un descargo.</Typography>
                {material.status !== "RESOLVED" && (
                  <Box
                    component="form"
                    sx={{ mt: 2 }}
                    onSubmit={(event) => {
                      event.preventDefault();
                      defenseMutation.mutate({
                        materialId: material.materialId,
                        description: defenseDescription.trim(),
                        files: defenseFiles,
                      });
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Descripción del descargo"
                      value={defenseDescription}
                      onChange={(event) => setDefenseDescription(event.target.value)}
                      multiline
                      minRows={3}
                      inputProps={{ maxLength: policy?.maxDescriptionLength ?? 2000 }}
                      helperText={`${defenseDescription.length}/${policy?.maxDescriptionLength ?? 2000}`}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      disabled={policyQuery.isLoading || policyQuery.isError}
                    >
                      Adjuntar evidencia
                      <input
                        hidden
                        type="file"
                        multiple
                        accept=".pdf,.png,.xlsx"
                        onChange={handleDefenseFileChange}
                      />
                    </Button>
                    {defenseFilesError && (
                      <Typography color="error" variant="body2">
                        {defenseFilesError}
                      </Typography>
                    )}
                    {defenseFiles.length > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {defenseFiles.map((file) => file.name).join(", ")}
                      </Typography>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 1, ml: 1 }}
                      disabled={
                        defenseMutation.isPending || policyQuery.isLoading || policyQuery.isError
                      }
                    >
                      {defenseMutation.isPending ? "Enviando..." : "Presentar descargo"}
                    </Button>
                    {policyQuery.isError && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        No se pudo cargar el límite de archivos. Reabrí el detalle para reintentar.
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
