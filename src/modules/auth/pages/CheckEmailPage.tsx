import { useLocation } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { AlarmClock, Mail, RefreshCw } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import { useResendConfirmation } from "../hooks/useResendConfirmation";

function PaperPlaneIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M48 4L24 28"
        stroke="#5B8DEF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 4L32 48L24 28L4 20L48 4Z"
        fill="#5B8DEF"
        fillOpacity="0.15"
        stroke="#5B8DEF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CheckEmailPage() {
  const { state } = useLocation();
  const email: string = state?.email ?? "";

  const { mutate, isPending, isSuccess } = useResendConfirmation();

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
        {/* Avión de papel */}
        <PaperPlaneIcon />

        {/* Título */}
        <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
          Revisá tu email
        </Typography>

        {/* Chip con el email */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#f5e6c8",
            borderRadius: "999px",
            px: 2.5,
            py: 0.75,
          }}
        >
          <Mail size={15} color="#92400e" />
          <Typography variant="body2" fontWeight={500} color="#92400e">
            {email}
          </Typography>
        </Box>

        {/* Descripción */}
        <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
          Te enviamos un link para activar tu cuenta.
          <br />
          Hacé click en ese link para continuar con el registro.
        </Typography>

        {/* Aviso de expiración */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: "#eef0fb",
            borderRadius: 3,
            px: 3,
            py: 2,
            width: "100%",
          }}
        >
          <AlarmClock size={20} color="#6366f1" style={{ flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" textAlign="left">
            El link expira en 24 horas. Pasado ese tiempo deberás registrarte de nuevo.
          </Typography>
        </Box>

        {/* Botón reenviar */}
        <Button
          variant="outlined"
          fullWidth
          size="large"
          disabled={!email || isPending || isSuccess}
          onClick={() => email && mutate(email)}
          startIcon={<RefreshCw size={16} />}
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontSize: 16,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "#e2e8f0",
            color: "text.primary",
            bgcolor: "#f8fafc",
            "&:hover": {
              bgcolor: "#f1f5f9",
              borderColor: "#cbd5e1",
            },
            "&.Mui-disabled": {
              bgcolor: "#f8fafc",
              color: "text.disabled",
            },
          }}
        >
          {isSuccess ? "Link reenviado ✓" : "Reenviar link"}
        </Button>
      </Box>
    </AuthLayout>
  );
}
