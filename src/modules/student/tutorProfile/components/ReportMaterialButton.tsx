import { Typography } from "@mui/material";
import { Flag } from "lucide-react";
import {
  reportLinkButtonSx,
  reportedLabelSx,
} from "@/modules/student/tutorProfile/styles/reportMaterialStyles";

interface ReportMaterialButtonProps {
  materialTitle: string;
  alreadyReported: boolean;
  onClick: () => void;
}

export default function ReportMaterialButton({
  materialTitle,
  alreadyReported,
  onClick,
}: ReportMaterialButtonProps) {
  return (
    <Typography
      component="button"
      type="button"
      onClick={onClick}
      aria-label={alreadyReported ? `${materialTitle}: ya denunciado` : `Denunciar ${materialTitle}`}
      sx={alreadyReported ? reportedLabelSx : reportLinkButtonSx}
    >
      <Flag size={14} />
      {alreadyReported ? "Reportado" : "Denunciar"}
    </Typography>
  );
}
