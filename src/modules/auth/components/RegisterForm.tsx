import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { BookSearch, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "@/modules/auth/schemas/user-register.schema";
import { useRegister } from "@/modules/auth/hooks/useRegister";
import { useRegistrationStore } from "@/modules/auth/hooks/useRegistrationStore";
import PasswordField from "@/modules/auth/components/PasswordField";

export default function RegisterForm() {
  const { mutate, isPending } = useRegister();
  const navigate = useNavigate();
  const setCredentials = useRegistrationStore((s) => s.setCredentials);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterFormData) => {
    if (data.role === "TUTOR") {
      setCredentials({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate("/auth/register/tutor");
    } else {
      mutate({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
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
          Email*
        </Typography>
        <TextField
          placeholder="usuario@gmail.com"
          type="email"
          fullWidth
          size="medium"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={inputSx}
        />
      </Box>

      {/* Contraseña */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Contraseña*
        </Typography>
        <PasswordField
          placeholder="••••••••"
          fullWidth
          size="medium"
          {...register("password")}
          error={!!errors.password}
          helperText={
            errors.password?.message ?? "Usá mayúsculas, minúsculas y un carácter especial."
          }
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
          render={({ field }) => (
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={field.value}
              onChange={(_, value) => value && field.onChange(value)}
              sx={{ gap: 1.5 }}
            >
              <ToggleButton
                value="TUTOR"
                sx={{
                  flexDirection: "column",
                  gap: 0.5,
                  py: 2,
                  border: "1px solid #e2e8f0 !important",
                  borderRadius: "10px !important",
                  "&.Mui-selected": {
                    bgcolor: "#eef2ff",
                    borderColor: "#5B6ED9 !important",
                  },
                }}
              >
                <NotebookPen size={20} />
                <Typography fontWeight={700} fontSize={15}>
                  Tutor
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ofrecer clases
                </Typography>
              </ToggleButton>

              <ToggleButton
                value="STUDENT"
                sx={{
                  flexDirection: "column",
                  gap: 0.5,
                  py: 2,
                  border: "1px solid #e2e8f0 !important",
                  borderRadius: "10px !important",
                  "&.Mui-selected": {
                    bgcolor: "#eef2ff",
                    borderColor: "#5B6ED9 !important",
                  },
                }}
              >
                <BookSearch size={20} />
                <Typography fontWeight={700} fontSize={15}>
                  Alumno
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Busco tutores para estudiar
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          )}
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
        disabled={isPending}
        startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : null}
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
        {isPending
          ? "Cargando..."
          : selectedRole === "TUTOR"
            ? "→ Continuar como tutor"
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
