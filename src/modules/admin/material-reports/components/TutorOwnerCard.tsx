import { Box, Typography } from "@mui/material";
import type { AdminMaterialReportTutor } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-detail.response";
import {
  tutorCardSx,
  tutorMetaSx,
  tutorNameSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";

interface TutorOwnerCardProps {
  tutor: AdminMaterialReportTutor;
}

export default function TutorOwnerCard({ tutor }: TutorOwnerCardProps) {
  return (
    <Box sx={tutorCardSx}>
      <Typography sx={tutorNameSx}>{tutor.fullName}</Typography>
      <Typography sx={tutorMetaSx}>{tutor.career}</Typography>
      <Typography sx={tutorMetaSx}>
        DNI {tutor.nationalId} · Legajo institucional {tutor.institutionalFileNumber}
      </Typography>
    </Box>
  );
}
