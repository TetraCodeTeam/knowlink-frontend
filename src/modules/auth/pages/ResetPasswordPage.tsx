import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Box, InputAdornment, Typography } from "@mui/material";
import { Lock, LinkIcon, ShieldCheck } from "lucide-react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import PasswordField from "@/modules/auth/components/PasswordField";
import AppButton from "@/shared/components/AppButton";
import { useResetPassword } from "@/modules/auth/hooks/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/modules/auth/schemas/reset-password.schema";
import { isInvalidResetLinkError } from "@/modules/auth/utils/resetLink.utils";
import { RESET_LINK_INVALID_MESSAGE } from "@/modules/auth/constants";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { mutate, isPending, isError, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const isLinkInvalid = !token || (isError && isInvalidResetLinkError(error));

  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) return;
    mutate({ token, newPassword: data.newPassword, confirmNewPassword: data.confirmNewPassword });
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
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: isLinkInvalid ? "#fef2f2" : "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLinkInvalid ? (
            <LinkIcon size={36} color="#dc2626" />
          ) : (
            <ShieldCheck size={36} color="#5B6ED9" />
          )}
        </Box>

        {isLinkInvalid ? (
          <>
            <Typography role="alert" variant="h5" fontWeight={700}>
              {RESET_LINK_INVALID_MESSAGE}
            </Typography>
            <AppButton fullWidth onClick={() => navigate("/auth/forgot-password")}>
              Solicitar nuevo enlace
            </AppButton>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                Nueva contraseña
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}
            >
              <PasswordField
                placeholder="Nueva contraseña"
                fullWidth
                autoComplete="new-password"
                slotProps={{ htmlInput: { "aria-label": "Nueva contraseña" } }}
                {...register("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={17} color="#AAAAAA" />
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordField
                placeholder="Confirmá la nueva contraseña"
                fullWidth
                autoComplete="new-password"
                slotProps={{ htmlInput: { "aria-label": "Confirmar nueva contraseña" } }}
                {...register("confirmNewPassword")}
                error={!!errors.confirmNewPassword}
                helperText={errors.confirmNewPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={17} color="#AAAAAA" />
                    </InputAdornment>
                  ),
                }}
              />
              <AppButton type="submit" fullWidth loading={isPending}>
                Restablecer contraseña
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
