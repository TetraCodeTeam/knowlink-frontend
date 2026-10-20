import { Box, Popover, Typography } from "@mui/material";
import NotificationsList from "@/modules/notifications/components/NotificationsList";
import type { NotificationsPopoverProps } from "@/modules/notifications/components/NotificationsPopover.types";

export default function NotificationsPopover({
  anchorEl,
  open,
  onClose,
}: NotificationsPopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{
        paper: {
          sx: {
            width: "min(380px, calc(100vw - 32px))",
            maxHeight: "70vh",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box
        sx={{
          padding: "16px",
          borderBottom: "1px solid #E8E8F0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E" }}>
          Notificaciones
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <NotificationsList onClose={onClose} />
      </Box>
    </Popover>
  );
}
