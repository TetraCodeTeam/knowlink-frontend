import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "@/modules/auth/schemas/user-register.schema";
import { checkAvailability } from "@/modules/auth/api/auth.api";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import PasswordField from "@/modules/auth/components/PasswordField";
import RoleToggleGroup from "@/shared/components/RoleToggleGroup";

export default function RegisterForm() {
  const navigate = useNavigate();
  const setCredentials = useRegistrationStore((s) => s.setCredentials);
  const [initialCredentials] = useState(() => useRegistrationStore.getState().credentials);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialCredentials ?? undefined,
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsCheckingEmail(true);

    try {
      await checkAvailability({ email: data.email });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo verificar la disponibilidad del correo. Intentá nuevamente.";
      setError("email", { type: "manual", message });
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(false);

    setCredentials({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: data.role,
    });

    if (data.role === "TUTOR") {
      navigate("/auth/register/tutor");
    } else {
      navigate("/auth/register/student");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%", maxWidth: 400 }}
    >
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" mb={1}>
        Crea tu cuenta
      </Typography>

      {/* Email */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Correo electrónico*
        </Typography>
        <TextField
          placeholder="usuario@gmail.com"
          type="email"
          fullWidth
          size="medium"
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
          sx={inputSx}
        />
      </Box>

      {/* Contraseña */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Contraseña*
        </Typography>
        <PasswordField
          placeholder="••••••••••••"
          fullWidth
          size="medium"
          {...register("password")}
          error={!!errors.password}
          helperText={
            errors.password?.message ?? "Usá mayúsculas, minúsculas y un carácter especial."
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={17} color="#AAAAAA" />
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />
      </Box>

      {/* Confirmar contraseña */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Confirmar contraseña*
        </Typography>
        <PasswordField
          placeholder="••••••••"
          fullWidth
          size="medium"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={17} color="#AAAAAA" />
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />
      </Box>

      {/* Selector de rol */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={1}>
          Quiero registrarme como*
        </Typography>
        <Controller
          name="role"
          control={control}
          render={({ field }) => <RoleToggleGroup value={field.value} onChange={field.onChange} />}
        />
        {errors.role && (
          <Typography variant="caption" color="error" mt={0.5} display="block">
            {errors.role.message}
          </Typography>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isCheckingEmail}
        startIcon={isCheckingEmail ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{
          bgcolor: "#5B6ED9",
          borderRadius: 3,
          py: 1.5,
          fontSize: 16,
          mt: 0.5,
          textTransform: "none",
          "&:hover": { bgcolor: "#3451d1" },
        }}
      >
        {isCheckingEmail
          ? "Verificando..."
          : selectedRole === "TUTOR"
            ? "→ Continuar como tutor"
            : selectedRole === "STUDENT"
              ? "→ Continuar como alumno"
              : "→ Crear cuenta y continuar"}
      </Button>
    </Box>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
  },
};
