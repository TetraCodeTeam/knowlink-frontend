import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { Box, Divider, InputAdornment, TextField } from "@mui/material";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas/login.schema";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import PasswordField from "@/modules/auth/components/PasswordField";
import RoleToggleGroup from "@/shared/components/RoleToggleGroup";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const selectedRole = watch("role");

  return (
    <>
      <Box component="form" onSubmit={handleSubmit((data) => mutate(data))} noValidate>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ─── Correo electrónico ─── */}
          <Box>
            <Box
              component="label"
              sx={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", mb: "6px", fontFamily: "Inter, sans-serif" }}
            >
              Correo Electrónico*
            </Box>
            <TextField
              type="email"
              placeholder="correo@ejemplo.com"
              fullWidth
              size="medium"
              autoComplete="email"
              aria-label="Correo electrónico"
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

          {/* ─── Contraseña ─── */}
          <Box>
            <Box
              component="label"
              sx={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", mb: "6px", fontFamily: "Inter, sans-serif" }}
            >
              Contraseña*
            </Box>
            <PasswordField
              placeholder="••••••••••••"
              fullWidth
              size="medium"
              autoComplete="current-password"
              aria-label="Contraseña"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
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

          {/* ─── Rol ─── */}
          <Box>
            <Box
              component="label"
              sx={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", mb: "6px", fontFamily: "Inter, sans-serif" }}
            >
              Quiero ingresar como
            </Box>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RoleToggleGroup
                  value={field.value}
                  onChange={field.onChange}
                  allowDeselect
                  onClear={() => field.onChange(undefined)}
                />
              )}
            />
            {errors.role && (
              <Box component="p" sx={{ color: "#d32f2f", fontSize: 13, mt: "4px", mb: 0 }}>
                {errors.role.message}
              </Box>
            )}
          </Box>

          {/* ─── Botón Iniciar Sesión ─── */}
          <Box
            component="button"
            type="submit"
            disabled={isPending}
            sx={{
              width: "100%",
              py: "14px",
              backgroundColor: "#5865C8",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: 17,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.75 : 1,
              fontFamily: "Inter, sans-serif",
              transition: "background-color 0.2s",
              "&:hover:not(:disabled)": { backgroundColor: "#4a54b4" },
            }}
          >
            {isPending
              ? "Iniciando sesión..."
              : selectedRole === "TUTOR"
                ? "Ingresar como tutor"
                : selectedRole === "STUDENT"
                  ? "Ingresar como alumno"
                  : "Iniciar Sesión"}
          </Box>
        </Box>
      </Box>

      {/* ─── Línea divisora (corta y centrada) ─── */}
      <Divider sx={{ my: 3, width: "50%", margin: "24px auto 24px auto", borderColor: "#D5D5D5" }} />
    </>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
  },
};