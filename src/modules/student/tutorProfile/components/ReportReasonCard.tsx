import { Box, Typography } from "@mui/material";
import { reportReasonCardSx } from "@/modules/student/tutorProfile/styles/reportMaterialStyles";

interface ReportReasonCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function ReportReasonCard({ label, selected, onSelect }: ReportReasonCardProps) {
  return (
    <Box
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      sx={reportReasonCardSx(selected)}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${selected ? "#5865C8" : "#B0B0B0"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {selected && <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#5865C8" }} />}
      </Box>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, color: "#333" }}>{label}</Typography>
    </Box>
  );
}
