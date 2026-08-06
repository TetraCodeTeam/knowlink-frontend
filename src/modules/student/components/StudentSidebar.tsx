import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Bell, AlertTriangle, LogOut } from "lucide-react";
import { Box, Typography, Avatar, Divider, Badge } from "@mui/material";
import type { ElementType } from "react";
import { useAuthStore } from "@/modules/auth/hooks/use-auth-store";
import { useStudentBadgesStore } from "@/modules/student/hooks/use-student-badges-store";
import { SIDEBAR_WIDTH } from "@/modules/student/components/StudentTopbar";

interface NavItem {
  icon: ElementType;
  label: string;
  path: string;
  badge?: "notifications" | "complaints";
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/student/home" },
  { icon: LayoutGrid, label: "Mis clases", path: "/student/classes" },
  { icon: Bell, label: "Notificaciones", path: "/student/notifications", badge: "notifications" },
  { icon: AlertTriangle, label: "Mis reclamos", path: "/student/complaints", badge: "complaints" },
];

const badgeSx = {
  "& .MuiBadge-badge": {
    fontSize: "10px",
    height: "16px",
    minWidth: "16px",
    padding: "0 3px",
  },
};

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authResponse, logout } = useAuthStore();
  const { notificationsCount, complaintsCount } = useStudentBadgesStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const getBadgeCount = (badge?: NavItem["badge"]) => {
    if (badge === "notifications") return notificationsCount;
    if (badge === "complaints") return complaintsCount;
    return 0;
  };

  const displayName = authResponse?.email.split("@")[0] ?? "Estudiante";
  const initials = displayName[0]?.toUpperCase() ?? "E";

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "80px",
        paddingBottom: "24px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          width: "100%",
          px: "12px",
        }}
      >
        {navItems.map(({ icon: Icon, label, path, badge }) => {
          const active = isActive(path);
          const count = getBadgeCount(badge);
          return (
            <Box
              key={path}
              role="button"
              tabIndex={0}
              onClick={() => navigate(path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(path);
                }
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 4px",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: active ? "#5865C8" : "transparent",
                "&:hover": {
                  backgroundColor: active ? "#5865C8" : "#F4F3FB",
                },
                transition: "background-color 0.15s ease",
              }}
            >
              <Badge badgeContent={count} color="error" invisible={count === 0} max={99} sx={badgeSx}>
                <Icon
                  size={26}
                  color={active ? "#FFFFFF" : "#3F4CAE"}
                  strokeWidth={active ? 2.5 : 2}
                />
              </Badge>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#FFFFFF" : "#3F4CAE",
                  marginTop: "6px",
                  textAlign: "center",
                  lineHeight: 1.2,
                  userSelect: "none",
                  wordBreak: "break-word",
                  maxWidth: "94px",
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ width: "100%", px: "12px", mb: "8px" }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={() => navigate("/student/profile")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/student/profile");
            }
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: "12px",
            padding: "8px 4px",
            backgroundColor: isActive("/student/profile") ? "#5865C8" : "transparent",
            "&:hover": {
              backgroundColor: isActive("/student/profile") ? "#5865C8" : "#F4F3FB",
            },
            transition: "background-color 0.15s ease",
          }}
        >
          <Avatar
            src={undefined}
            sx={{
              width: 42,
              height: 42,
              backgroundColor: isActive("/student/profile") ? "#FFFFFF" : "#5865C8",
              color: isActive("/student/profile") ? "#5865C8" : "#FFFFFF",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>
          <Typography
            sx={{
              fontSize: "12px",
              color: isActive("/student/profile") ? "#FFFFFF" : "#3F4CAE",
              marginTop: "4px",
              textAlign: "center",
              maxWidth: "88px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {displayName}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: "60%", borderColor: "#E8E8F0", mb: "8px" }} />

      <Box sx={{ width: "100%", px: "12px" }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={handleLogout}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleLogout();
            }
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            padding: "10px 4px",
            borderRadius: "12px",
            "&:hover": { backgroundColor: "#F4F3FB" },
            transition: "background-color 0.15s ease",
          }}
        >
          <LogOut size={26} color="#3F4CAE" />
          <Typography
            sx={{
              fontSize: "12px",
              color: "#3F4CAE",
              marginTop: "4px",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            Salir
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
