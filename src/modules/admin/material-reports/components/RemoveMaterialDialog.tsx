import { useEffect } from "react";
import { TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { useRemoveMaterial } from "@/modules/admin/material-reports/hooks/useRemoveMaterial";
import {
  removeMaterialSchema,
  type RemoveMaterialFormValues,
} from "@/modules/admin/material-reports/schemas/remove-material.schema";
import { dialogFieldSx } from "@/modules/admin/material-reports/styles/material-reports.styles";

interface RemoveMaterialDialogProps {
  materialId: string;
  open: boolean;
  onClose: () => void;
}

export default function RemoveMaterialDialog({
  materialId,
  open,
  onClose,
}: RemoveMaterialDialogProps) {
  const mutation = useRemoveMaterial(materialId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RemoveMaterialFormValues>({
    resolver: zodResolver(removeMaterialSchema),
    defaultValues: { reason: "" },
  });

  useEffect(() => {
    if (open) reset({ reason: "" });
  }, [open, reset]);

  const onSubmit = async (values: RemoveMaterialFormValues) => {
    try {
      await mutation.mutateAsync({ reason: values.reason.trim() || undefined });
      onClose();
    } catch {
      // El hook muestra el message del backend y el diálogo queda abierto.
    }
  };

  return (
    <AppConfirmDialog
      open={open}
      title="¿Dar de baja este material?"
      message="Dejará de estar disponible para todos los alumnos. Podés dejar un motivo adicional, y se lo notificaremos al tutor junto con los denunciantes."
      severity="danger"
      confirmLabel="Dar de baja"
      onCancel={onClose}
      onConfirm={() => void handleSubmit(onSubmit)()}
      isPending={mutation.isPending}
      content={
        <TextField
          {...register("reason")}
          label="Motivo (opcional)"
          placeholder="Ej. Contenido duplicado de otra guía"
          multiline
          minRows={3}
          fullWidth
          error={Boolean(errors.reason)}
          helperText={errors.reason?.message}
          disabled={mutation.isPending}
          sx={dialogFieldSx}
        />
      }
    />
  );
}
