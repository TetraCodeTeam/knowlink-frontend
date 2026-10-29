import type React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Bell, AlertTriangle, LogOut } from "lucide-react";
import { Box, Typography, Avatar, Divider, Badge } from "@mui/material";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useStudentBadgesStore } from "@/modules/student/hooks/useStudentBadgesStore";
import { SIDEBAR_WIDTH } from "@/modules/student/components/StudentTopbar";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "@/modules/auth/logout/hooks/useLogout";
import LogoutDialog from "@/modules/auth/logout/components/LogoutDialog";
import NotificationsPanel from "@/modules/notifications/components/NotificationsPanel";
import { useUnreadNotificationsCount } from "@/modules/notifications/hooks/useUnreadNotificationsCount";

interface NavItem {
  icon: React.ElementType;
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
  const { authResponse } = useAuthStore();
  const { complaintsCount } = useStudentBadgesStore();
  const { triggerLogout, isPending: isLoggingOut } = useLogout();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const wasNotificationsOpenRef = useRef(false);

  useEffect(() => {
    if (isNotificationsOpen) {
      wasNotificationsOpenRef.current = true;
    } else if (wasNotificationsOpenRef.current) {
      wasNotificationsOpenRef.current = false;
      notificationsRef.current?.focus();
    }
  }, [isNotificationsOpen]);
  const { data } = useUnreadNotificationsCount();
  const unreadCount = data?.count ?? 0;
  const isActive = (path: string, badge?: NavItem["badge"]) => {
    if (badge === "notifications") return isNotificationsOpen;
    // Home es la comunidad: sus subpáginas (hilos, mis publicaciones, podio) mantienen Home activo.
    if (path === "/student/home") {
      return location.pathname === path || location.pathname.startsWith("/student/community/");
    }
    return location.pathname === path;
  };

  const handleLogout = () => setIsLogoutOpen(true);

  const handleNotificationsClick = () => setIsNotificationsOpen((open) => !open);

  const handleNotificationsKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsNotificationsOpen((open) => !open);
    }
  };

  const handleCloseNotifications = () => setIsNotificationsOpen(false);

  const getBadgeCount = (badge?: NavItem["badge"]) => {
    if (badge === "notifications") return unreadCount;
    if (badge === "complaints") return complaintsCount;
    return 0;
  };

  const getAriaLabel = (label: string, badge?: NavItem["badge"]) => {
    if (badge === "notifications" && unreadCount > 0) {
      return `${label}, ${unreadCount} sin leer`;
    }
    return label;
  };

  const displayName = authResponse?.email.split("@")[0] ?? "Estudiante";
  const initials = displayName[0]?.toUpperCase() ?? "E";

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
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
          justifyContent: "space-evenly",
          flex: 1,
          width: "100%",
          px: "12px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {navItems.map(({ icon: Icon, label, path, badge }) => {
          const active = isActive(path, badge);
          const count = getBadgeCount(badge);
          const isNotifications = badge === "notifications";
          return (
            <Box
              key={path}
              ref={isNotifications ? notificationsRef : undefined}
              role="button"
              tabIndex={0}
              aria-label={getAriaLabel(label, badge)}
              aria-haspopup={isNotifications ? "dialog" : undefined}
              aria-expanded={isNotifications ? isNotificationsOpen : undefined}
              onClick={isNotifications ? handleNotificationsClick : () => navigate(path)}
              onKeyDown={
                isNotifications
                  ? handleNotificationsKeyDown
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(path);
                      }
                    }
              }
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
              <Badge
                badgeContent={count}
                color="error"
                invisible={count === 0}
                max={99}
                sx={badgeSx}
              >
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

      <LogoutDialog
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => triggerLogout()}
        isPending={isLoggingOut}
      />

      <NotificationsPanel
        open={isNotificationsOpen}
        onClose={handleCloseNotifications}
        sidebarWidth={SIDEBAR_WIDTH}
      />
    </Box>
  );
}
