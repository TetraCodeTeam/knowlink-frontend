import { useEffect, useState } from "react";
import { ArrowLeftToLine, CheckCheck } from "lucide-react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import NotificationsList from "@/modules/notifications/components/NotificationsList";
import OtherRoleBanner from "@/modules/notifications/components/OtherRoleBanner";
import { useMarkAllNotificationsAsRead } from "@/modules/notifications/hooks/useMarkAllNotificationsAsRead";
import { useUnreadNotificationsCount } from "@/modules/notifications/hooks/useUnreadNotificationsCount";
import type { NotificationsPanelProps } from "@/modules/notifications/components/NotificationsPanel.types";
import type { NotificationReadFilter } from "@/modules/notifications/types/notification-read-filter.type";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const TABS: { label: string; status: NotificationReadFilter }[] = [
  { label: "No Leído", status: "UNREAD" },
  { label: "Leído", status: "READ" },
];

export default function NotificationsPanel({
  open,
  onClose,
  sidebarWidth,
}: NotificationsPanelProps) {
  const [status, setStatus] = useState<NotificationReadFilter>("UNREAD");
  const { data } = useUnreadNotificationsCount();
  const markAll = useMarkAllNotificationsAsRead();
  const unreadCount = data?.count ?? 0;
  const otherRoleCount = data?.otherRoleCount ?? 0;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <Box
        aria-hidden
        data-testid="notifications-backdrop"
        onClick={onClose}
        sx={{
          position: "fixed",
          // Oscurece todo menos el menú lateral, para destacar que se está en Notificaciones.
          inset: `0 0 0 ${sidebarWidth}px`,
          backgroundColor: "rgba(17, 17, 40, 0.45)",
          animation: `${fadeIn} 0.2s ease-out`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          zIndex: 99,
        }}
      />
      <Box
        role="dialog"
        aria-label="Notificaciones"
        sx={{
          position: "fixed",
          top: 0,
          left: `${sidebarWidth}px`,
          width: `min(380px, calc(100vw - ${sidebarWidth}px))`,
          height: "100vh",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E8E8F0",
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.06)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, padding: "20px 16px 12px" }}>
          <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1A1A2E", flex: 1 }}>
            Notificaciones
          </Typography>
          <Box
            aria-label={`${unreadCount} notificaciones sin leer`}
            sx={{
              minWidth: 26,
              height: 26,
              borderRadius: unreadCount > 99 ? "13px" : "50%",
              padding: unreadCount > 99 ? "0 7px" : 0,
              backgroundColor: "#EDEBFA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#5865C8" }}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Typography>
          </Box>
          <IconButton
            aria-label="Colapsar panel"
            onClick={onClose}
            size="small"
            sx={{ color: "#3F4CAE" }}
          >
            <ArrowLeftToLine size={20} />
          </IconButton>
        </Box>

        {otherRoleCount > 0 && <OtherRoleBanner otherRoleCount={otherRoleCount} />}

        {unreadCount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, py: 0.5 }}>
            <Button
              size="small"
              startIcon={<CheckCheck size={16} aria-hidden />}
              disabled={markAll.isPending}
              onClick={() => markAll.mutate()}
              sx={{ textTransform: "none", fontSize: "12px", fontWeight: 600, color: "#3F4CAE" }}
            >
              Marcar todo como leído
            </Button>
          </Box>
        )}

        <Box sx={{ display: "flex", borderBottom: "1px solid #E8E8F0" }} role="tablist">
          {TABS.map((tab) => {
            const active = status === tab.status;
            return (
              <Box
                key={tab.status}
                role="tab"
                aria-selected={active}
                tabIndex={0}
                onClick={() => setStatus(tab.status)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setStatus(tab.status);
                  }
                }}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  padding: "12px 8px",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#1A1A2E" : "#8A8AA3",
                  borderBottom: active ? "2px solid #5865C8" : "2px solid transparent",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <NotificationsList status={status} onClose={onClose} />
        </Box>
      </Box>
    </>
  );
}
