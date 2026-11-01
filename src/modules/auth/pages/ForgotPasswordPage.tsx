import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { KeyRound, Mail, MailCheck } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import AppButton from "@/shared/components/AppButton";
import { useForgotPassword } from "@/modules/auth/hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/modules/auth/schemas/forgot-password.schema";
import { FORGOT_PASSWORD_SUCCESS_MESSAGE } from "@/modules/auth/constants";

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

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
          {isSuccess ? (
            <MailCheck size={36} color="#5B6ED9" />
          ) : (
            <KeyRound size={36} color="#5B6ED9" />
          )}
        </Box>

        {isSuccess ? (
          <>
            <Typography variant="h4" fontWeight={700}>
              Revisá tu correo
            </Typography>
            <Typography role="status" variant="body1" color="text.secondary" lineHeight={1.7}>
              {FORGOT_PASSWORD_SUCCESS_MESSAGE}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              El enlace es válido por 30 minutos y solo puede usarse una vez.
            </Typography>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                ¿Olvidaste tu contraseña?
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                Ingresá tu correo electrónico y te enviaremos un enlace para restablecerla.
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit((data) => mutate(data.email))}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}
            >
              <TextField
                type="email"
                placeholder="correo@ejemplo.com"
                fullWidth
                autoComplete="email"
                slotProps={{ htmlInput: { "aria-label": "Correo electrónico" } }}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={17} color="#AAAAAA" />
                    </InputAdornment>
                  ),
                }}
              />
              <AppButton type="submit" fullWidth loading={isPending}>
                Enviar enlace
              </AppButton>
            </Box>
          </>
        )}

        <Link
          to="/auth/login"
          style={{ color: "#3F4CAE", fontWeight: 600, textDecoration: "none" }}
        >
          Volver al login
        </Link>
      </Box>
    </AuthLayout>
  );
}
