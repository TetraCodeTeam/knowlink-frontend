import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Box, Divider } from "@mui/material";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas/login.schema";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import RoleToggleGroup from "@/shared/components/RoleToggleGroup";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

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
              Correo Electrónico
            </Box>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#AAAAAA",
                  display: "flex",
                  pointerEvents: "none",
                }}
              >
                <Mail size={17} />
              </Box>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="kl-input"
                aria-label="Correo electrónico"
                autoComplete="email"
                style={{
                  padding: "14px 14px 14px 45px",
                  fontSize: "15px",
                  borderColor: errors.email ? "#d32f2f" : undefined,
                }}
                {...register("email")}
              />
            </Box>
            {errors.email && (
              <Box component="p" sx={{ color: "#d32f2f", fontSize: 13, mt: "4px", mb: 0 }}>
                {errors.email.message}
              </Box>
            )}
          </Box>

          {/* ─── Contraseña ─── */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "6px" }}>
              <Box
                component="label"
                sx={{ fontSize: 14, fontWeight: 500, color: "#333", fontFamily: "Inter, sans-serif" }}
              >
                Contraseña
              </Box>
            </Box>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#AAAAAA",
                  display: "flex",
                  pointerEvents: "none",
                }}
              >
                <Lock size={17} />
              </Box>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="kl-input"
                aria-label="Contraseña"
                autoComplete="current-password"
                style={{
                  padding: "14px 45px 14px 45px",
                  fontSize: "15px",
                  borderColor: errors.password ? "#d32f2f" : undefined,
                }}
                {...register("password")}
              />
              <Box
                component="button"
                type="button"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#AAAAAA",
                  display: "flex",
                  p: 0,
                  "&:hover": { color: "#666" },
                }}
              >
                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
              </Box>
            </Box>
            {errors.password && (
              <Box component="p" sx={{ color: "#d32f2f", fontSize: 13, mt: "4px", mb: 0 }}>
                {errors.password.message}
              </Box>
            )}
          </Box>

          <Box>
            <Box
              component="label"
              sx={{ display: "block", fontSize: 14, fontWeight: 500, color: "#333", mb: "6px", fontFamily: "Inter, sans-serif" }}
            >
              Ingresar como
            </Box>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RoleToggleGroup value={field.value} onChange={field.onChange} showDescription={false} />
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
            {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Box>
        </Box>
      </Box>

      {/* ─── Línea divisora (corta y centrada) ─── */}
      <Divider sx={{ my: 3, width: "50%", margin: "24px auto 24px auto", borderColor: "#D5D5D5" }} />
    </>
  );
}
