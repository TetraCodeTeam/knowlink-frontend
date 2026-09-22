import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TutorSidebar, { TUTOR_SIDEBAR_WIDTH } from "@/modules/tutor/components/TutorSidebar";
import { TutorSessionConfirmationWidget } from "@/modules/attendance/components/TutorSessionconfirmationwidget";
import { useAutoOpenSessionConfirmation } from "@/modules/attendance/hooks/useAutoOpenSessionConfirmation";
import { useConfirmSessionAttendance } from "@/modules/attendance/hooks/useConfirmSessionAttendance";

export default function TutorLayout() {
  useAutoOpenSessionConfirmation();
  const { mutateAsync: confirmSessionAttendance } = useConfirmSessionAttendance();

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
        onConfirm={({ sessionId, code }) => confirmSessionAttendance({ sessionId, code })}
      />
    </Box>
  );
}
