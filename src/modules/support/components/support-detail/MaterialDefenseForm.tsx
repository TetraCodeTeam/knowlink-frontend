import { Box, Button, TextField, Typography } from "@mui/material";
import { FileText, Paperclip } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { useMaterialDefenseForm } from "@/modules/support/hooks/useMaterialDefenseForm";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";
import { detailSmallButtonSx } from "@/modules/support/styles/supportDetail.styles";
import { supportBodyTextSx } from "@/modules/support/styles/supportText.styles";

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
      <AppButton
        fullWidth
        appVariant="soft"
        startIcon={<FileText size={14} />}
        onClick={openEditor}
        sx={detailSmallButtonSx}
      >
        Presentar descargo
      </AppButton>
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
        startIcon={<Paperclip size={14} />}
        sx={{ textTransform: "none", fontSize: 14 }}
      >
        Adjuntar evidencias
        <input hidden type="file" multiple accept=".pdf,.png,.xlsx" onChange={handleFileChange} />
      </Button>
      {filesError && (
        <Typography color="error" sx={{ fontSize: 14 }}>
          {filesError}
        </Typography>
      )}
      {files.length > 0 && (
        <Typography sx={supportBodyTextSx}>{files.map((file) => file.name).join(", ")}</Typography>
      )}
      {policyIsError && (
        <Typography color="error" sx={{ fontSize: 14 }}>
          No se pudo cargar el límite de archivos.
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <AppButton
          appVariant="outline"
          size="small"
          onClick={closeEditor}
          disabled={isPending}
          sx={detailSmallButtonSx}
        >
          Cancelar
        </AppButton>
        <AppButton
          type="submit"
          size="small"
          disabled={isPending || policyIsLoading || policyIsError}
          sx={detailSmallButtonSx}
        >
          {isPending ? "Enviando..." : "Presentar descargo"}
        </AppButton>
      </Box>
    </Box>
  );
}
