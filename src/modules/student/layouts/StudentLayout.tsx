import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import StudentSidebar from "@/modules/student/components/StudentSidebar";
import StudentTopbar, {
  SIDEBAR_WIDTH,
  TOPBAR_HEIGHT,
} from "@/modules/student/components/StudentTopbar";
import { StudentTokenWidget } from "@/modules/attendance/components/StudentTokenWidget";
import { useAutoShowStudentToken } from "@/modules/attendance/hooks/useAutoShowStudentToken";

export default function StudentLayout() {
  useAutoShowStudentToken();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F4F3FB" }}>
      <StudentSidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: `${SIDEBAR_WIDTH}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StudentTopbar />
        <Box
          component="main"
          sx={{
            flex: 1,
            marginTop: `${TOPBAR_HEIGHT}px`,
            minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <StudentTokenWidget />
    </Box>
  );
}
