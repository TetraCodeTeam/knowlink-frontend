import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import { Box } from "@mui/material";

export default function RegisterPage() {
  const illustration = (
    <Box
      component="img"
      src="/register-image.png"
      alt="Estudiante con libros"
      sx={{ width: "100%" }}
    />
  );

  return (
    <AuthLayout illustration={illustration}>
      <RegisterForm />
    </AuthLayout>
  );
}
