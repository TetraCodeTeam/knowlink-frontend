import { useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import BookingCard from "@/modules/student/booking/components/BookingCard";
import type { BookingSlot } from "@/modules/student/booking/components/BookingCard";

// Página temporal solo para previsualizar BookingCard mientras se investiga
// la librería de calendario a usar. Eliminar/reemplazar cuando el calendario
// real esté integrado.
export default function BookingPreviewPage() {
  const [slot, setSlot] = useState<BookingSlot | null>(null);


  return (
    <Box sx={{ display: "flex", gap: 6, p: 6 }}>
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          border: "1px solid #e2e8f0",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.secondary" }}>
          Calendario
        </Typography>
      </Paper>

      <BookingCard selectedSlot={slot} />
    </Box>
  );
}