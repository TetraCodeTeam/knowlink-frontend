import AppConfirmDialog from "@/shared/components/AppConfirmDialog";

interface DeactivateSubjectDialogProps {
  open: boolean;
  subjectName: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeactivateSubjectDialog({
  open,
  subjectName,
  isPending,
  onConfirm,
  onCancel,
}: DeactivateSubjectDialogProps) {
  return (
    <AppConfirmDialog
      open={open}
      title="Desactivar materia"
      message={`La materia "${subjectName}" dejará de aparecer en el buscador y no podrá recibir nuevas reservas. Podés reactivarla cuando quieras desde la sección Materias de tu perfil.`}
      severity="warning"
      confirmLabel="Desactivar"
      cancelLabel="Cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isPending={isPending}
    />
  );
}
