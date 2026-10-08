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
  if (alreadyReported) {
    return (
      <Typography component="span" sx={reportedLabelSx}>
        <Flag size={14} />
        Reportado
      </Typography>
    );
  }

  return (
    <Typography
      component="button"
      type="button"
      onClick={onClick}
      aria-label={`Denunciar ${materialTitle}`}
      sx={reportLinkButtonSx}
    >
      <Flag size={14} />
      Denunciar
    </Typography>
  );
}
