//diseño de mensaje se estado en los slots dentro del calendario de reserva. Se usa para mostrar mensajes de validación al usuario, como "selección inválida" o "violación de aviso mínimo".
import { Box, Popper, Typography } from "@mui/material";

interface BookingValidationMessageProps {
  message: string;
  anchorEl: HTMLElement | null;
}

export default function BookingValidationMessage({ message, anchorEl }: BookingValidationMessageProps) {
  return (
    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="right"
      modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
      sx={{ zIndex: 1500, pointerEvents: "none" }}
    >
      <Box
        sx={{
          width: "fit-content",
          maxWidth: 200, 
          px: 1.5,
          py: 1,
          bgcolor: "#fffcf5",
          border: "1.5px solid #f3e7c9",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(248, 204, 91, 0.83)",
        }}
      >
        <Typography
        sx={{
          color: "#2d2d2d",
          fontSize: 12,
          fontWeight: 550,
          lineHeight: 1.35,
          textAlign: "center",
        }}
      >
        {message}
        </Typography>
      </Box>
    </Popper>
  );
}
