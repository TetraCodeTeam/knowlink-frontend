import { type ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface DataItemProps {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
}

export default function DataItem({ icon, label, value }: DataItemProps) {
  if (!value) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "14px", mb: "18px" }}>
      <Box sx={{ color: "#555", mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "13.5px", color: "#222", fontWeight: 600, mb: "2px" }}>
          {label}
        </Typography>
        <Typography
          sx={{ fontSize: "15px", color: "#777", fontWeight: 400, overflowWrap: "anywhere" }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
