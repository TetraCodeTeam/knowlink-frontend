import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import TutorSidebar, { TUTOR_SIDEBAR_WIDTH } from "@/modules/tutor/components/TutorSidebar";
import { TutorSessionConfirmationWidget } from "@/modules/attendance/components/TutorSessionconfirmationwidget";
import { confirmSessionAttendance } from "@/modules/attendance/api/attendance.api";
import { useAutoOpenSessionConfirmation } from "@/modules/attendance/hooks/useAutoOpenSessionConfirmation";

export default function TutorLayout() {
  useAutoOpenSessionConfirmation();
  const queryClient = useQueryClient();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#E6E4F2" }}>
      <TutorSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          marginLeft: `${TUTOR_SIDEBAR_WIDTH}px`,
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
      <TutorSessionConfirmationWidget
        onConfirm={async ({ sessionId, code }) => {
          await confirmSessionAttendance(sessionId, code);
          // Evita que el próximo poll siga trayendo esta reserva como
          // "elegible" con datos stale del último fetch.
          void queryClient.invalidateQueries({ queryKey: ["attendance-upcoming-bookings", "TUTOR"] });
        }}
      />
    </Box>
  );
}
