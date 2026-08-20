import { Box, Popper, Typography } from "@mui/material";

interface BookingValidationMessageProps {
  message: string;
  width?: number;
  anchorEl: HTMLElement | null;
}

export default function BookingValidationMessage({ message, width = 220, anchorEl }: BookingValidationMessageProps) {
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
          boxShadow: "0 8px 12px e8c56a",
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
