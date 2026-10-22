import type React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useRatingPopupStore } from "@/modules/class-history/hooks/useRatingPopupStore";
import { useClaimPopupStore } from "@/modules/claim/hooks/useClaimPopupStore";
import {
  getNotificationAction,
  getNotificationConfig,
} from "@/modules/notifications/constants/notification-type-config";
import type { NotificationItemProps } from "@/modules/notifications/components/NotificationItem.types";

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const authResponse = useAuthStore((s) => s.authResponse);
  const openRatingPopup = useRatingPopupStore((s) => s.open);
  const openClaimPopup = useClaimPopupStore((s) => s.open);
  const { icon: Icon, tileColor, iconColor } = getNotificationConfig(notification.type);
  const action = getNotificationAction(notification.type, authResponse?.role ?? "");
  const title = notification.title ?? notification.message;

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.notificationId);
    }
    if (action.kind === "rating" && notification.referenceId) {
      openRatingPopup(notification.referenceId);
    } else if (action.kind === "claim" && notification.referenceId) {
      openClaimPopup(notification.referenceId);
    } else if (action.kind === "navigate") {
      navigate(action.route);
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
        padding: "14px 16px",
        cursor: "pointer",
        borderBottom: "1px solid #EEEEF5",
        backgroundColor: "#FFFFFF",
        "&:hover": { backgroundColor: "#F8F7FE" },
        transition: "background-color 0.15s ease",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          backgroundColor: tileColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={iconColor} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1A1A2E",
            lineHeight: 1.3,
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>
        {notification.title != null && (
          <Typography
            sx={{
              fontSize: "12px",
              color: "#6B6B80",
              marginTop: "2px",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {notification.message}
          </Typography>
        )}
        {action.kind !== "none" && (
          <Typography
            sx={{
              marginTop: "4px",
              textAlign: "right",
              fontSize: "12px",
              fontWeight: 600,
              color: "#3F4CAE",
            }}
          >
            {action.label} →
          </Typography>
        )}
      </Box>
    </Box>
  );
}
