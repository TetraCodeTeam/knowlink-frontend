import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useRatingPopupStore } from "@/modules/class-history/hooks/useRatingPopupStore";
import { useClaimPopupStore } from "@/modules/claim/hooks/useClaimPopupStore";
import { NOTIFICATION_MESSAGE_PREVIEW_CHARS } from "@/modules/notifications/constants/notification-display";
import {
  getNotificationAction,
  getNotificationConfig,
} from "@/modules/notifications/constants/notification-type-config";
import { formatNotificationDate } from "@/modules/notifications/utils/format-notification-date";
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
  const [expanded, setExpanded] = useState(false);
  const { icon: Icon, tileColor, iconColor } = getNotificationConfig(notification.type);
  const action = getNotificationAction(
    notification.type,
    authResponse?.role ?? "",
    notification.actionStatus
  );
  const title = notification.title ?? notification.message;
  const isUnread = !notification.read;
  const hasSecondaryMessage = notification.title != null;
  const isLongMessage =
    hasSecondaryMessage && notification.message.length > NOTIFICATION_MESSAGE_PREVIEW_CHARS;
  const isSettledRating = action.kind === "rating-done";
  const isRatingAction = action.kind === "rating" || isSettledRating;
  const messageId = `notification-message-${notification.notificationId}`;
  const ariaSuffix = action.kind === "rating-done" ? ". Ya calificaste." : "";

  const navigateToAction = (route: string) => {
    const config = getNotificationConfig(notification.type);
    if (config.appendReference && notification.referenceId) {
      navigate(`${route}/${notification.referenceId}`);
      return;
    }
    if (config.referenceSearchParam && notification.referenceId) {
      const separator = route.includes("?") ? "&" : "?";
      navigate(`${route}${separator}${config.referenceSearchParam}=${notification.referenceId}`);
      return;
    }
    navigate(route);
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.notificationId);
    }
    if (isRatingAction && notification.referenceId) {
      openRatingPopup(notification.referenceId);
    } else if (action.kind === "claim" && notification.referenceId) {
      openClaimPopup(notification.referenceId);
    } else if (action.kind === "navigate") {
      navigateToAction(action.route);
    }
    // Una notificación informativa no tiene destino: cerrar el panel confundiría.
    if (action.kind !== "none") {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleToggleExpanded = (event: MouseEvent) => {
    event.stopPropagation();
    setExpanded((current) => !current);
    if (!notification.read) {
      onMarkAsRead(notification.notificationId);
    }
  };

  return (
    <Box
      data-testid="notification-item"
      sx={{
        borderBottom: "1px solid #EEEEF5",
        backgroundColor: isUnread ? "#F4F3FB" : "#FFFFFF",
        opacity: isSettledRating ? 0.7 : 1,
        "&:hover": { backgroundColor: isUnread ? "#EDECF9" : "#F8F7FE" },
        transition: "background-color 0.15s ease",
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`${notification.read ? "Leída" : "No leída"}: ${notification.message}${ariaSuffix}`}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          padding: "14px 16px",
          cursor: "pointer",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                flex: 1,
                fontSize: "14px",
                fontWeight: isUnread ? 600 : 400,
                color: "#1A1A2E",
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>
            {isUnread && (
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#3F4CAE",
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
          {hasSecondaryMessage && (
            <Typography
              id={messageId}
              sx={{
                fontSize: "12px",
                color: "#6B6B80",
                marginTop: "2px",
                lineHeight: 1.4,
                wordBreak: "break-word",
                ...(expanded
                  ? { whiteSpace: "pre-wrap" }
                  : {
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }),
              }}
            >
              {notification.message}
            </Typography>
          )}
          <Typography sx={{ fontSize: "11px", color: "#8A8AA3", marginTop: "4px" }}>
            {formatNotificationDate(notification.createdAt)}
          </Typography>
          {action.kind !== "none" && (
            <Typography
              sx={{
                marginTop: "4px",
                textAlign: "right",
                fontSize: "12px",
                fontWeight: 600,
                color: isSettledRating ? "#6B6B80" : "#3F4CAE",
              }}
            >
              {isSettledRating ? action.label : `${action.label} →`}
            </Typography>
          )}
        </Box>
      </Box>
      {isLongMessage && (
        <Box sx={{ pl: "68px", pr: "16px", pb: "10px" }}>
          <Button
            size="small"
            aria-expanded={expanded}
            aria-controls={messageId}
            onClick={handleToggleExpanded}
            sx={{
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 600,
              color: "#3F4CAE",
              p: 0,
              minWidth: 0,
            }}
          >
            {expanded ? "Ver menos" : "Ver más"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
