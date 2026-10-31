import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminSidebar, { ADMIN_SIDEBAR_WIDTH } from "@/modules/admin/components/AdminSidebar";
import { ADMIN_CONTENT_FONT_FAMILY, ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

export default function AdminLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: ADMIN_TOKENS.fondo3,
        fontFamily: ADMIN_CONTENT_FONT_FAMILY,
      }}
    >
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          marginLeft: `${ADMIN_SIDEBAR_WIDTH}px`,
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
