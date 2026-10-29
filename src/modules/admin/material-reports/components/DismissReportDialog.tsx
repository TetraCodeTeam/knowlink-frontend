import { useEffect } from "react";
import { TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { useDismissMaterialReport } from "@/modules/admin/material-reports/hooks/useDismissMaterialReport";
import {
  dismissReportSchema,
  type DismissReportFormValues,
} from "@/modules/admin/material-reports/schemas/dismiss-report.schema";
import { dialogFieldSx } from "@/modules/admin/material-reports/styles/material-reports.styles";

interface DismissReportDialogProps {
  materialId: string;
  open: boolean;
  onClose: () => void;
}

export default function DismissReportDialog({
  materialId,
  open,
  onClose,
}: DismissReportDialogProps) {
  const mutation = useDismissMaterialReport(materialId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DismissReportFormValues>({
    resolver: zodResolver(dismissReportSchema),
    defaultValues: { note: "" },
  });

  useEffect(() => {
    if (open) reset({ note: "" });
  }, [open, reset]);

  const onSubmit = async (values: DismissReportFormValues) => {
    try {
      await mutation.mutateAsync({ note: values.note.trim() || undefined });
      onClose();
    } catch {
      // El hook muestra el message del backend y el diálogo queda abierto.
    }
  };

  return (
    <AppConfirmDialog
      open={open}
      title="¿Desestimar esta denuncia?"
      message="El material seguirá disponible sin cambios y la denuncia quedará archivada como no procedente."
      severity="warning"
      confirmLabel="Desestimar"
      onCancel={onClose}
      onConfirm={() => void handleSubmit(onSubmit)()}
      isPending={mutation.isPending}
      content={
        <TextField
          {...register("note")}
          label="Nota interna (opcional)"
          placeholder="Ej. El archivo no infringe derechos de autor"
          multiline
          minRows={3}
          fullWidth
          error={Boolean(errors.note)}
          helperText={errors.note?.message}
          disabled={mutation.isPending}
          sx={dialogFieldSx}
        />
      }
    />
  );
}
