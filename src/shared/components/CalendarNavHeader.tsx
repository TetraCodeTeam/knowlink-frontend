import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavHeaderProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarNavHeader({ label, onPrev, onNext }: CalendarNavHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
      <IconButton size="small" onClick={onPrev} sx={{ color: "#5B6ED9" }}>
        <ChevronLeft size={20} />
      </IconButton>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1a1a2e", minWidth: 220, textAlign: "center" }}>
        {label}
      </Typography>
      <IconButton size="small" onClick={onNext} sx={{ color: "#5B6ED9" }}>
        <ChevronRight size={20} />
      </IconButton>
    </Box>
  );
}