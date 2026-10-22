import { Alert, Box, Button, Skeleton, Typography } from "@mui/material";
import { Bell } from "lucide-react";
import NotificationItem from "@/modules/notifications/components/NotificationItem";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { useMarkNotificationAsRead } from "@/modules/notifications/hooks/useMarkNotificationAsRead";
import type { NotificationsListProps } from "@/modules/notifications/components/NotificationsList.types";

const EMPTY_STATE: Record<NotificationsListProps["status"], { title: string; subtitle: string }> = {
  ALL: { title: "Estas al día", subtitle: "No tienes notificaciones pendientes por ahora" },
  UNREAD: { title: "Estas al día", subtitle: "No tienes notificaciones pendientes por ahora" },
  READ: {
    title: "Sin notificaciones leídas",
    subtitle: "Las notificaciones que marques como leídas aparecerán acá",
  },
};

export default function NotificationsList({ status, onClose }: NotificationsListProps) {
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useNotifications(status, true);
  const markAsRead = useMarkNotificationAsRead();

  if (isLoading) {
    return (
      <Box>
        {[0, 1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={64}
            sx={{ mx: 2, my: 1, borderRadius: "8px" }}
          />
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Reintentar
          </Button>
        }
      >
        No pudimos cargar tus notificaciones.
      </Alert>
    );
  }

  const notifications = data?.pages.flatMap((page) => page.content) ?? [];

  if (notifications.length === 0) {
    const empty = EMPTY_STATE[status];
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          py: 8,
          px: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            backgroundColor: "#EDEBFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={40} color="#5865C8" />
        </Box>
        <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#5865C8" }}>
          {empty.title}
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#6B6B80", maxWidth: 260 }}>
          {empty.subtitle}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onMarkAsRead={markAsRead.mutate}
          onClose={onClose}
        />
      ))}
      {hasNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "12px 16px" }}>
          <Button
            variant="outlined"
            size="small"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Cargando…" : "Cargar más"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
