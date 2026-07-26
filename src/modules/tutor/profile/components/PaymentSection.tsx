import { Box, Typography } from "@mui/material";
import {
  PAYMENT_BG,
  LINKED_BORDER,
  UNLINKED_BORDER,
} from "@/modules/tutor/profile/constants/profileColors.constants";

interface PaymentSectionProps {
  linked: boolean;
}

export default function PaymentSection({ linked }: PaymentSectionProps) {
  if (linked) {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
          p: "14px 22px",
          borderRadius: "10px",
          backgroundColor: PAYMENT_BG,
          border: `1.5px solid ${LINKED_BORDER}`,
        }}
      >
        <Box
          component="img"
          src="/mercado-pago-logo.png"
          alt="MercadoPago"
          sx={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }}
        />
        <Box>
          <Typography sx={{ fontSize: "17px", fontWeight: 600, color: "#1A6B3A" }}>
            Mercado Pago vinculado
          </Typography>
          <Typography component="span" sx={{ fontSize: "14px", color: LINKED_BORDER }}>
            Desvincular
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
          p: "14px 22px",
          borderRadius: "10px",
          backgroundColor: PAYMENT_BG,
          border: `1.5px solid ${UNLINKED_BORDER}`,
        }}
      >
        <Box
          component="img"
          src="/mercado-pago-logo.png"
          alt="MercadoPago"
          sx={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }}
        />
        <Typography sx={{ fontSize: "17px", fontWeight: 600, color: "#9D3422" }}>
          Vincular Mercado Pago
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "15px", color: "#888", mt: "8px", lineHeight: 1.5 }}>
        Para comenzar a percibir pagos por tus tutorías, por favor finaliza la vinculación de tu
        cuenta en la sección de perfil.
      </Typography>
    </Box>
  );
}
