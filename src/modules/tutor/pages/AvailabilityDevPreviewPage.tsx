import { Box, Typography } from "@mui/material";
import AvailabilityEditor from "@/modules/tutor/availability/components/AvailabilityEditor";
import MinNoticeHoursPanel from "@/modules/tutor/availability/components/MinNoticeHoursPanel";

export default function AvailabilityDevPreviewPage() {
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="caption" sx={{ bgcolor: "#fef9c3", color: "#854d0e", px: 1.5, py: 0.5, borderRadius: 1, alignSelf: "flex-start" }}>
        ⚠️ Ruta temporal de desarrollo — borrar cuando se integre a TutorProfilePage
      </Typography>

      <AvailabilityEditor />
      <MinNoticeHoursPanel />
    </Box>
  );
}