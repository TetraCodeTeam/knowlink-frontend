import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { registerSchema, type RegisterFormValues } from "@/modules/auth/schemas/register.schema";
import { useRegister } from "@/modules/auth/hooks/useRegister";

export default function RegisterForm() {
  const { isPending, mutate } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
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
        Crear cuenta
      </Typography>

      <TextField
        label="Nombre"
        fullWidth
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />

      <TextField
        label="Apellido"
        fullWidth
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        label="Confirmar contraseña"
        type="password"
        fullWidth
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isPending}
        startIcon={isPending ? <CircularProgress size={16} /> : null}
      >
        {isPending ? "Registrando..." : "Crear cuenta"}
      </Button>
    </Box>
  );
}
