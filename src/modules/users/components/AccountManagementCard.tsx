import { ClockAlert, ShieldAlert, Trash2 } from "lucide-react";
import { Paper, Stack, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";

interface AccountManagementCardProps {
  onDeactivateAccount?: () => void;
  onDeleteAccount?: () => void;
}

export default function AccountManagementCard({
  onDeactivateAccount,
  onDeleteAccount,
}: AccountManagementCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "0.2px solid #e5897b7a" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <ShieldAlert size={28} color="#E58A7B" />
        <Typography variant="h5" component="h2" fontWeight={500}>
          Gestión de Cuenta
        </Typography>
      </Stack>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Podés desactivar tu cuenta temporalmente o eliminarla definitivamente.
      </Typography>

      <Stack spacing={2.5}>
        {onDeactivateAccount ? (
          <AppButton
            appVariant="outline"
            startIcon={<ClockAlert size={20} color="#585858" />}
            fullWidth
            onClick={onDeactivateAccount}
          >
            Desactivar cuenta
          </AppButton>
        ) : null}
        {onDeleteAccount ? (
          <AppButton
            appVariant="soft-danger"
            startIcon={<Trash2 size={20} color="#b94c3c" />}
            fullWidth
            onClick={onDeleteAccount}
          >
            Eliminar cuenta
          </AppButton>
        ) : null}
      </Stack>
    </Paper>
  );
}
