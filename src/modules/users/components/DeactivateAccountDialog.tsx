import AppConfirmDialog from "@/shared/components/AppConfirmDialog";

interface DeactivateAccountDialogProps {
  open: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeactivateAccountDialog({
  open,
  isPending,
  onConfirm,
  onCancel,
}: DeactivateAccountDialogProps) {
  return (
    <AppConfirmDialog
      open={open}
      severity="warning"
      title="Desactivar cuenta"
      message="Tu cuenta dejará de ser visible para el resto de los usuarios y vamos a cerrar tu sesión. Tu información y tu historial se conservan. Para reactivarla, volvé a iniciar sesión con tu correo y tu contraseña y confirmá la reactivación."
      confirmLabel="Desactivar cuenta"
      cancelLabel="Cancelar"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
