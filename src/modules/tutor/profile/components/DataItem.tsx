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
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "18px", mb: "40px" }}>
      <Box sx={{ color: "#555", mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: "17px", color: "#222", fontWeight: 600, mb: "4px" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "19px", color: "#777", fontWeight: 400 }}>{value}</Typography>
      </Box>
    </Box>
  );
}
