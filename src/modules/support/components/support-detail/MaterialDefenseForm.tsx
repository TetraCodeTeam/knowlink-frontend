import { Box, Button, TextField, Typography } from "@mui/material";
import { FileText, Paperclip } from "lucide-react";
import { useMaterialDefenseForm } from "@/modules/support/hooks/useMaterialDefenseForm";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";

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
  const {
    isEditing,
    description,
    files,
    filesError,
    maxDescriptionLength,
    isPending,
    openEditor,
    closeEditor,
    setDescription,
    handleFileChange,
    handleSubmit,
  } = useMaterialDefenseForm(materialId, policy);

  if (!isEditing) {
    return (
      <Button
        fullWidth
        variant="outlined"
        startIcon={<FileText size={13} />}
        onClick={openEditor}
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
        inputProps={{ maxLength: maxDescriptionLength }}
        helperText={`${description.length}/${maxDescriptionLength}`}
        disabled={isPending}
      />
      <Button
        component="label"
        variant="outlined"
        size="small"
        disabled={policyIsLoading || policyIsError || isPending}
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
        <Typography color="error" sx={{ fontSize: 12 }}>
          No se pudo cargar el límite de archivos.
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          size="small"
          onClick={closeEditor}
          disabled={isPending}
          sx={{ textTransform: "none", fontSize: 12 }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={isPending || policyIsLoading || policyIsError}
          sx={{ bgcolor: "#293E9D", textTransform: "none", fontSize: 12 }}
        >
          {isPending ? "Enviando..." : "Presentar descargo"}
        </Button>
      </Box>
    </Box>
  );
}
