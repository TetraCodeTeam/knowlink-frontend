import { Alert, Box, Button, Skeleton } from "@mui/material";
import { Bell } from "lucide-react";
import EmptyState from "@/shared/components/EmptyState";
import NotificationItem from "@/modules/notifications/components/NotificationItem";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { useMarkNotificationAsRead } from "@/modules/notifications/hooks/useMarkNotificationAsRead";
import type { NotificationsListProps } from "@/modules/notifications/components/NotificationsList.types";

export default function NotificationsList({ onClose }: NotificationsListProps) {
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useNotifications(true);
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
    return (
      <EmptyState icon={<Bell size={48} color="#5865C8" />} message="No tenés notificaciones" />
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
