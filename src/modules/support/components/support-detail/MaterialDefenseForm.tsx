import { useState, type ChangeEvent, type FormEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FileText, Paperclip } from "lucide-react";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";
import { useSubmitMaterialDefense } from "@/modules/support/hooks/useSupportDetailMutations";

interface MaterialDefenseFormProps {
  materialId: string;
  policy: MaterialReportingPolicy | undefined;
  policyIsLoading: boolean;
  policyIsError: boolean;
}

export function MaterialDefenseForm({
  materialId,
  policy,
  policyIsLoading,
  policyIsError,
}: MaterialDefenseFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState("");
  const mutation = useSubmitMaterialDefense(materialId);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const maxAttachments = policy?.maxDefenseAttachments ?? 5;
    const maxSize = policy?.maxDefenseAttachmentSizeBytes ?? 10 * 1024 * 1024;
    const invalidFile = selectedFiles.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return !["pdf", "png", "xlsx"].includes(extension ?? "") || file.size > maxSize;
    });

    if (selectedFiles.length > maxAttachments) {
      setFilesError(`Podés adjuntar hasta ${maxAttachments} archivos.`);
      setFiles([]);
      event.target.value = "";
      return;
    }
    if (invalidFile) {
      setFilesError(
        "Los archivos deben ser PDF, PNG o XLSX y respetar el tamaño máximo permitido."
      );
      setFiles([]);
      event.target.value = "";
      return;
    }
    setFilesError("");
    setFiles(selectedFiles);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(
      { description: description.trim(), files },
      {
        onSuccess: () => {
          setDescription("");
          setFiles([]);
          setIsEditing(false);
        },
      }
    );
  };

  if (!isEditing) {
    return (
      <Button
        fullWidth
        variant="outlined"
        startIcon={<FileText size={13} />}
        onClick={() => setIsEditing(true)}
        sx={{ textTransform: "none", fontSize: 9 }}
      >
        Presentar descargo
      </Button>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
    >
      <TextField
        fullWidth
        size="small"
        label="Descripción del descargo"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        minRows={3}
        inputProps={{ maxLength: policy?.maxDescriptionLength ?? 2000 }}
        helperText={`${description.length}/${policy?.maxDescriptionLength ?? 2000}`}
        disabled={mutation.isPending}
      />
      <Button
        component="label"
        variant="outlined"
        size="small"
        disabled={policyIsLoading || policyIsError || mutation.isPending}
        startIcon={<Paperclip size={13} />}
        sx={{ textTransform: "none", fontSize: 12 }}
      >
        Adjuntar evidencias
        <input hidden type="file" multiple accept=".pdf,.png,.xlsx" onChange={handleFileChange} />
      </Button>
      {filesError && (
        <Typography color="error" sx={{ fontSize: 12 }}>
          {filesError}
        </Typography>
      )}
      {files.length > 0 && (
        <Typography sx={{ fontSize: 12, color: "#686C7B" }}>
          {files.map((file) => file.name).join(", ")}
        </Typography>
      )}
      {policyIsError && (
        <Typography color="error" sx={{ fontSize: 12  }}>
          No se pudo cargar el límite de archivos.
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          size="small"
          onClick={() => setIsEditing(false)}
          disabled={mutation.isPending}
          sx={{ textTransform: "none", fontSize: 12 }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={mutation.isPending || policyIsLoading || policyIsError}
          sx={{ bgcolor: "#293E9D", textTransform: "none", fontSize: 12 }}
        >
          {mutation.isPending ? "Enviando..." : "Presentar descargo"}
        </Button>
      </Box>
    </Box>
  );
}
