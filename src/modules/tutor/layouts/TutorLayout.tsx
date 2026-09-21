import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TutorSidebar, { TUTOR_SIDEBAR_WIDTH } from "@/modules/tutor/components/TutorSidebar";
import { SessionConfirmationWidget } from "@/modules/attendance/components/TutorSessionconfirmationwidget";
import { confirmSessionAttendance } from "@/modules/attendance/api/attendance.api";
import { useAutoOpenSessionConfirmation } from "@/modules/attendance/hooks/useAutoOpenSessionConfirmation";

export default function TutorLayout() {
  useAutoOpenSessionConfirmation();

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
      <SessionConfirmationWidget
        onConfirm={({ sessionId, code }) => confirmSessionAttendance(sessionId, code)}
      />
    </Box>
  );
}
