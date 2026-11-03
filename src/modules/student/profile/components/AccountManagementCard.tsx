import { ClockAlert, ShieldAlert, Trash2 } from "lucide-react";
import { Paper, Stack, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";

interface AccountManagementCardProps {
  onDeactivateAccount: () => void;
  onDeleteAccount: () => void;
}

export const AccountManagementCard = ({
  onDeactivateAccount,
  onDeleteAccount,
}: AccountManagementCardProps) => {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "0.2px solid #e5897b7a" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <ShieldAlert size={24} color="#E58A7B" />
        <Typography variant="h6" component="h2" fontWeight={500} sx={{ fontSize: 18 }}>
          Gestión de Cuenta
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
        Estas acciones pueden afectar permanentemente tu cuenta en KnowLink.
      </Typography>

      <Stack spacing={1.5}>
        <AppButton
          appVariant="outline"
          size="small"
          sx={{ py: 0.75, fontSize: 14 }}
          startIcon={<ClockAlert size={18} color="#585858" />}
          fullWidth
          onClick={onDeactivateAccount}
        >
          Desactivar cuenta
        </AppButton>
        <AppButton
          appVariant="soft-danger"
          size="small"
          sx={{ py: 0.75, fontSize: 14 }}
          startIcon={<Trash2 size={18} color="#b94c3c" />}
          fullWidth
          onClick={onDeleteAccount}
        >
          Eliminar cuenta
        </AppButton>
      </Stack>
    </Paper>
  );
};
