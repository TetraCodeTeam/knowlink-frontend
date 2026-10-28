import { Box, Card, CardContent, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function Step3MercadoPago({ onNext, onBack, onSkip }: Step3Props) {
  const handleLink = () => {
    // Placeholder: en producción redirige al OAuth de Mercado Pago
    onNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center">
        Mercado pago
      </Typography>

      <Card
        elevation={0}
        sx={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 3, bgcolor: "#f8f9ff" }}
      >
        <CardContent sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={3} lineHeight={1.7}>
            Podrás continuar con el registro de tu cuenta sin vincular Mercado Pago, pero no podrás
            recibir reservas hasta que completes este paso en tu perfil
          </Typography>
          <AppButton appVariant="soft" onClick={handleLink} sx={{ gap: 1.5, py: 1, px: 2 }}>
            <Box
              component="img"
              src="/mercado-pago-logo.png"
              alt="Mercado Pago"
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            Vincular Mercado Pago
          </AppButton>
        </CardContent>
      </Card>

      <AppButton appVariant="primary" fullWidth onClick={onNext}>
        → Continuar
      </AppButton>

      <Typography
        variant="body2"
        color="primary"
        sx={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={onSkip}
      >
        Omitir por ahora
      </Typography>

      <AppButton appVariant="outline" fullWidth onClick={onBack}>
        ← Volver
      </AppButton>
    </Box>
  );
}
