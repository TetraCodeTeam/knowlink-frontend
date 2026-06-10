import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";
import RegisterForm from "@/modules/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
        gap: 2,
      }}
    >
      <RegisterForm />
      <Typography variant="body2">
        ¿Ya tenés cuenta?{" "}
        <Link component={RouterLink} to="/auth/login">
          Iniciá sesión
        </Link>
      </Typography>
    </Box>
  );
}
