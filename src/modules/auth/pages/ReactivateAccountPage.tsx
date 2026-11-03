import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ShieldAlert } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import AppButton from "@/shared/components/AppButton";
import { useReactivateAccount } from "@/modules/auth/hooks/useReactivateAccount";
import { useReactivationStore } from "@/modules/auth/hooks/useReactivationStore";
import type { LoginFormValues } from "@/modules/auth/schemas/login.schema";

export default function ReactivateAccountPage() {
  const navigate = useNavigate();
  const { pendingCredentials, clear } = useReactivationStore();
  // Snapshot en memoria: sobrevive al doble montaje de StrictMode y a un clear externo.
  const [credentials] = useState<LoginFormValues | undefined>(pendingCredentials);
  const { mutate, isPending } = useReactivateAccount();

  useEffect(() => {
    return () => clear();
  }, [clear]);

  if (!credentials) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleCancel = () => {
    clear();
    navigate("/auth/login", { replace: true });
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          width: "100%",
          maxWidth: 420,
          py: 2,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldAlert size={36} color="#5B6ED9" />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
            Tu cuenta está desactivada
          </Typography>
          <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
            ¿Querés reactivarla?
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
            Tus datos y tu historial siguen intactos.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          <AppButton
            fullWidth
            loading={isPending}
            disabled={isPending}
            onClick={() => mutate(credentials)}
          >
            {isPending ? "Reactivando..." : "Reactivar cuenta"}
          </AppButton>
          <AppButton appVariant="outline" fullWidth disabled={isPending} onClick={handleCancel}>
            Cancelar
          </AppButton>
        </Box>
      </Box>
    </AuthLayout>
  );
}
