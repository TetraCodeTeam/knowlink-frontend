import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import TutorSidebar, { TUTOR_SIDEBAR_WIDTH } from "@/modules/student/tutorProfile/components/components/TutorSidebar";

export default function TutorLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#E6E4F2" }}>
      <TutorSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: `${TUTOR_SIDEBAR_WIDTH}px`,
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
