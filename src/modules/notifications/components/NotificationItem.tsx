import type React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { getNotificationConfig, getNotificationRoute } from "@/modules/notifications/constants/notification-type-config";
import { formatNotificationDate } from "@/modules/notifications/utils/format-notification-date";
import type { NotificationItemProps } from "@/modules/notifications/components/NotificationItem.types";

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const authResponse = useAuthStore((s) => s.authResponse);
  const { icon: Icon } = getNotificationConfig(notification.type);

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.notificationId);
    }
    const route = getNotificationRoute(notification.type, authResponse?.role ?? "");
    if (route) {
      navigate(route);
    }
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${notification.read ? "Leída" : "No leída"}: ${notification.message}`}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        padding: "12px 16px",
        cursor: "pointer",
        backgroundColor: notification.read ? "#FFFFFF" : "#F4F3FB",
        "&:hover": { backgroundColor: "#EDEBFA" },
        transition: "background-color 0.15s ease",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "#EDEBFA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color="#5865C8" />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: notification.read ? 400 : 600,
            color: "#1A1A2E",
            wordBreak: "break-word",
          }}
        >
          {notification.message}
        </Typography>
        <Typography sx={{ fontSize: "11px", color: "#8A8AA3", marginTop: "4px" }}>
          {formatNotificationDate(notification.createdAt)}
        </Typography>
      </Box>
      {!notification.read && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#5865C8",
            flexShrink: 0,
            marginTop: "4px",
          }}
        />
      )}
    </Box>
  );
}
