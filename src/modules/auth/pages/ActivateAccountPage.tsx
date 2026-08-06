import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import { useVerifyAccount } from "@/modules/auth/hooks/use-verify-account";
import AppButton from "@/shared/components/AppButton";

export default function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const { mutate, isPending } = useVerifyAccount();

  const handleActivate = () => {
    if (!userId || !token) return;

    mutate(
      { userId, token },
      { onSuccess: () => navigate("/auth/login", { replace: true }) },
    );
  };

  const isInvalidLink = !userId || !token;

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        {/* Ícono */}
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
          <ShieldCheck size={36} color="#5B6ED9" />
        </Box>

        {/* Título y descripción */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            ¡Bienvenido a KnowLink!
          </Typography>
          <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
            Estamos felices de que te unas a nuestra comunidad. Hacé clic en el
            botón para activar tu cuenta y empezar a explorar la plataforma.
          </Typography>
        </Box>

        {/* Estado: link inválido */}
        {isInvalidLink && (
          <Box
            sx={{
              bgcolor: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 3,
              px: 3,
              py: 2,
              width: "100%",
            }}
          >
            <Typography variant="body2" color="error">
              El link es inválido o ya expiró. Solicitá un nuevo enlace desde la
              pantalla de registro.
            </Typography>
          </Box>
        )}

        {/* Botón de activación */}
        <AppButton
          fullWidth
          loading={isPending}
          disabled={isInvalidLink}
          onClick={handleActivate}
        >
          Activar cuenta
        </AppButton>
      </Box>
    </AuthLayout>
  );
}