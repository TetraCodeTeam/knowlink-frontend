import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas/login.schema";
import { useLogin } from "@/modules/auth/hooks/useLogin";

export default function LoginForm() {
  const { isPending, mutate } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 400 }}
    >
      <Typography variant="h5" component="h1" fontWeight={700} textAlign="center">
        Iniciar sesión
      </Typography>

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isPending}
        startIcon={isPending ? <CircularProgress size={16} /> : null}
      >
        {isPending ? "Ingresando..." : "Ingresar"}
      </Button>
    </Box>
  );
}
