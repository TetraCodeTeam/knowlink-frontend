import AppConfirmDialog from "@/shared/components/AppConfirmDialog";

interface ConfirmResolutionDialogProps {
  open: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmResolutionDialog({
  open,
  isPending,
  onConfirm,
  onCancel,
}: ConfirmResolutionDialogProps) {
  return (
    <AppConfirmDialog
      open={open}
      title="¿Confirmar esta resolución?"
      message="Se transferirán los fondos retenidos según lo indicado y se notificará a ambas partes junto con tu justificación. Esta decisión no puede modificarse después."
      confirmLabel="Confirmar resolución"
      severity="warning"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
