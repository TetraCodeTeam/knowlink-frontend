import FrankieCallout from "@/shared/frankie/FrankieCallout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import PasswordField from "@/modules/auth/components/PasswordField";
import {
  deleteAccountSchema,
  type DeleteAccountFormValues,
} from "@/modules/users/schemas/delete-account.schema";
import { useDeleteAccount } from "@/modules/users/hooks/useDeleteAccount";

const DELETE_ACCOUNT_WARNING =
  "Esta acción es permanente. Vamos a borrar tus datos personales y no vas a poder " +
  "recuperarlos. Tu historial de clases que otras personas ya vivieron conservará solo el " +
  "nombre «Usuario eliminado».";

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const { mutate, isPending, blockedMessage, passwordError, reset } = useDeleteAccount();
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
  });

  const fieldError = errors.password?.message ?? passwordError;

  const handleCancel = () => {
    resetForm({ password: "" });
    reset();
    onClose();
  };

  return (
    <AppConfirmDialog
      open={open}
      severity="danger"
      title="¿Eliminar tu cuenta definitivamente?"
      message={DELETE_ACCOUNT_WARNING}
      requireCheckbox
      confirmLabel="Eliminar definitivamente"
      cancelLabel="Cancelar"
      isPending={isPending}
      onConfirm={handleSubmit(({ password }) => mutate(password))}
      onCancel={handleCancel}
      content={
        <>
          <PasswordField
            label="Contraseña"
            fullWidth
            autoComplete="current-password"
            disabled={isPending}
            error={Boolean(fieldError)}
            helperText={fieldError}
            {...register("password")}
          />
          {blockedMessage ? (
            <FrankieCallout kind="warning" sx={{ mt: 1 }}>
              {blockedMessage}
            </FrankieCallout>
          ) : null}
        </>
      }
    />
  );
}
