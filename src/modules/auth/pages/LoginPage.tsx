import { Box } from "@mui/material";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import LoginForm from "@/modules/auth/components/LoginForm";

const DOT_PATTERN = {
  backgroundImage: "radial-gradient(circle, rgba(147,132,210,0.3) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

export default function LoginPage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ══════════════════════════════════
          PANEL IZQUIERDO — fondo lavanda
      ══════════════════════════════════ */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#F0EEFE",
          ...DOT_PATTERN,
          display: "flex",
          flexDirection: "column",
          p: "36px 44px",
        }}
      >
        {/* Logo KnowLink */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <GraduationCap size={32} color="#3F4CAE" />
          <Box
            component="span"
            sx={{ fontSize: 28, fontWeight: 700, color: "#1a1a2e", fontFamily: "Inter, sans-serif" }}
          >
            KnowLink
          </Box>
        </Box>

        {/* Ilustración + texto, centrados verticalmente */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Tarjeta blanca semitransparente con la ilustración */}
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.62)",
              borderRadius: "20px",
              p: 4,
              maxWidth: 360,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 240,
            }}
          >
            {/*
              Descargá la ilustración desde: https://storyset.com
              Buscá "Working" o "Studying" → estilo "Amico"
              Guardala en la carpeta public/ como: studying-illustration.png
            */}
            <Box
              component="img"
              src="/studying-illustration.png"
              alt="Persona estudiando"
              sx={{ width: "100%", maxWidth: 320, height: "auto", objectFit: "contain" }}
            />
          </Box>

          {/* Texto debajo de la ilustración */}
          <Box sx={{ maxWidth: 360, width: "100%", display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "fit-content", margin: "0 auto" }}>
              <Box
                component="h2"
                sx={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#1a1a2e",
                  m: 0,
                  lineHeight: 1.3,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Conecta, Aprende,{" "}
                <Box component="span" sx={{ color: "#3F4CAE" }}>
                  Avanza.
                </Box>
              </Box>
              <Box
                component="p"
                sx={{
                  color: "#555",
                  mt: 3,
                  mb: 0,
                  fontSize: 17,
                  lineHeight: 1.6,
                  fontFamily: "Inter, sans-serif",
                  textAlign: "left",
                  width: 0,
                  minWidth: "100%",
                }}
              >
                Únete a nuestra comunidad académica. Comparte conocimiento, encuentra tutores y avanza tus metas
                universitarias.
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════
          PANEL DERECHO — formulario
      ══════════════════════════════════ */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: "48px 64px",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ maxWidth: 420, width: "100%" }}>
          {/* Título */}
          <Box
            component="h1"
            sx={{ fontSize: 42, fontWeight: 800, color: "#1a1a2e", mb: 1.5, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
          >
            Bienvenido de Nuevo
          </Box>

          {/* Subtítulo */}
          <Box
            component="p"
            sx={{ color: "#666", mb: 4, mt: 0, fontSize: 15, fontFamily: "Inter, sans-serif" }}
          >
            Ingresa tus credenciales para acceder a tu panel académico
          </Box>

          {/* Formulario */}
          <LoginForm />

          {/* Enlace a registro */}
          <Box
            component="p"
            sx={{ textAlign: "center", mt: 0, color: "#555", fontSize: 15, fontFamily: "Inter, sans-serif" }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              to="/auth/register"
              className="kl-register-link"
              aria-label="Ir al registro"
            >
              Regístrate
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
