import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import { Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";

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
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 400 }}>
        <RegisterForm />

        {/* Línea divisora (corta y centrada), igual que en el login */}
        <Divider sx={{ width: "50%", margin: "20px auto 12px auto", borderColor: "#D5D5D5" }} />

        {/* Enlace a login */}
        <Box
          component="p"
          sx={{
            textAlign: "center",
            mt: 0,
            mb: 0,
            color: "#555",
            fontSize: 15,
            fontFamily: "Inter, sans-serif",
          }}
        >
          ¿Ya tienes una cuenta?{" "}
          <Box
            component={Link}
            to="/auth/login"
            sx={{
              color: "#3F4CAE",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover, &:focus-visible": { textDecoration: "underline" },
            }}
          >
            Login
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}
