import { Box, Button, Skeleton } from "@mui/material";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import FrankieErrorState from "@/shared/frankie/FrankieErrorState";
import NotificationItem from "@/modules/notifications/components/NotificationItem";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { useMarkNotificationAsRead } from "@/modules/notifications/hooks/useMarkNotificationAsRead";
import type { NotificationsListProps } from "@/modules/notifications/components/NotificationsList.types";

const EMPTY_STATE: Record<NotificationsListProps["status"], { title: string; subtitle: string }> = {
  ALL: { title: "Estás al día", subtitle: "No tienes notificaciones pendientes por ahora" },
  UNREAD: { title: "Estás al día", subtitle: "No tienes notificaciones pendientes por ahora" },
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
      <FrankieErrorState
        message="No pudimos cargar tus notificaciones."
        onRetry={() => void refetch()}
      />
    );
  }

  const notifications = data?.pages.flatMap((page) => page.content) ?? [];

  if (notifications.length === 0) {
    const empty = EMPTY_STATE[status];
    return (
      <FrankieEmptyState
        compact
        mood={status === "READ" ? "thinking" : "happy"}
        accessories={status === "READ" ? ["question"] : ["sparkles"]}
        size={190}
        title={empty.title}
        message={empty.subtitle}
      />
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
