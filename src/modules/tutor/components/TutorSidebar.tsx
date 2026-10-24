import type React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  CalendarClock,
  Bell,
  LogOut,
  GraduationCap,
  BookOpenCheck,
  MessageCircleQuestion,
} from "lucide-react";
import { Box, Typography, Avatar, Divider, Badge } from "@mui/material";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useTutorBadgesStore } from "@/modules/tutor/hooks/useTutorBadgesStore";
import LogoutDialog from "@/modules/auth/logout/components/LogoutDialog";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "@/modules/auth/logout/hooks/useLogout";
import NotificationsPanel from "@/modules/notifications/components/NotificationsPanel";
import { useUnreadNotificationsCount } from "@/modules/notifications/hooks/useUnreadNotificationsCount";

export const TUTOR_SIDEBAR_WIDTH = 108;

const SIDEBAR_BG = "#4C5CB5";
const ACTIVE_BG = "rgba(199, 200, 255, 0.34)";
const HOVER_BG = "rgba(255, 255, 255, 0.1)";
const TEXT_COLOR = "#FFFFFF";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: "notifications" | "requests";
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/tutor/home" },
  { icon: CalendarClock, label: "Mi agenda", path: "/tutor/availability" },
  { icon: BookOpenCheck, label: "Mis clases", path: "/tutor/classes" },
  { icon: Bell, label: "Notificaciones", path: "/tutor/notifications", badge: "notifications" },
  {
    icon: MessageCircleQuestion,
    label: "Soporte y solicitudes",
    path: "/tutor/requests",
    badge: "requests",
  },
];

const badgeSx = {
  "& .MuiBadge-badge": {
    fontSize: "10px",
    height: "16px",
    minWidth: "16px",
    padding: "0 3px",
  },
};

export default function TutorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authResponse } = useAuthStore();
  const { requestsCount } = useTutorBadgesStore();
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
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const isActive = (path: string, badge?: NavItem["badge"]) => {
    if (badge === "notifications") return isNotificationsOpen;
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
    if (badge === "requests") return requestsCount;
    return 0;
  };

  const getAriaLabel = (label: string, badge?: NavItem["badge"]) => {
    if (badge === "notifications" && unreadCount > 0) {
      return `${label}, ${unreadCount} sin leer`;
    }
    return label;
  };

  const displayName = authResponse?.email.split("@")[0] ?? "Tutor";
  const initials = displayName[0]?.toUpperCase() ?? "T";

  return (
    <Box
      component="nav"
      sx={{
        width: TUTOR_SIDEBAR_WIDTH,
        height: "100vh",
        backgroundColor: SIDEBAR_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "24px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <GraduationCap size={28} color={TEXT_COLOR} strokeWidth={2} />
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 700,
            color: TEXT_COLOR,
            marginTop: "4px",
            letterSpacing: "0.5px",
            userSelect: "none",
          }}
        >
          KnowLink
        </Typography>
      </Box>

      {/* Nav items */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          width: "100%",
          px: "8px",
          flex: 1,
          overflowY: "auto",
          py: "16px",
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
                padding: "16px 4px",
                borderRadius: "12px",
                cursor: "pointer",
                backgroundColor: active ? ACTIVE_BG : "transparent",
                "&:hover": {
                  backgroundColor: active ? ACTIVE_BG : HOVER_BG,
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
                <Icon size={24} color={TEXT_COLOR} strokeWidth={active ? 2.5 : 2} />
              </Badge>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: active ? 600 : 400,
                  color: TEXT_COLOR,
                  marginTop: "4px",
                  textAlign: "center",
                  lineHeight: 1.2,
                  userSelect: "none",
                  wordBreak: "break-word",
                  maxWidth: "92px",
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Profile */}
      <Box sx={{ width: "100%", px: "8px", mb: "8px" }}>
        <Box
          role="button"
          tabIndex={0}
          onClick={() => navigate("/tutor/profile")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/tutor/profile");
            }
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            borderRadius: "12px",
            padding: "8px 4px",
            backgroundColor: isActive("/tutor/profile") ? ACTIVE_BG : "transparent",
            "&:hover": {
              backgroundColor: isActive("/tutor/profile") ? ACTIVE_BG : HOVER_BG,
            },
            transition: "background-color 0.15s ease",
          }}
        >
          <Avatar
            src={undefined}
            sx={{
              width: 38,
              height: 38,
              backgroundColor: isActive("/tutor/profile")
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.2)",
              color: isActive("/tutor/profile") ? SIDEBAR_BG : TEXT_COLOR,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>
          <Typography
            sx={{
              fontSize: "11px",
              color: TEXT_COLOR,
              marginTop: "4px",
              textAlign: "center",
              maxWidth: "92px",
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

      <Divider sx={{ width: "60%", borderColor: "rgba(255, 255, 255, 0.3)", mb: "8px" }} />

      {/* Logout */}
      <Box sx={{ width: "100%", px: "8px" }}>
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
            "&:hover": { backgroundColor: HOVER_BG },
            transition: "background-color 0.15s ease",
          }}
        >
          <LogOut size={22} color={TEXT_COLOR} />
          <Typography
            sx={{
              fontSize: "11px",
              color: TEXT_COLOR,
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
        sidebarWidth={TUTOR_SIDEBAR_WIDTH}
      />
    </Box>
  );
}
