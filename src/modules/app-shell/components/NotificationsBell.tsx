import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge, IconButton } from "@mui/material";
import { Bell } from "lucide-react";
import {
  NAV_BADGE_COLOR,
  NAV_BADGE_MAX,
  TOPBAR_HEIGHT,
} from "@/modules/app-shell/constants/navigation.constants";
import type { NavTheme } from "@/modules/app-shell/interfaces/navigation.interface";
import NotificationsPanel from "@/modules/notifications/components/NotificationsPanel";
import { useUnreadNotificationsCount } from "@/modules/notifications/hooks/useUnreadNotificationsCount";

interface NotificationsBellProps {
  theme: NavTheme;
}

export default function NotificationsBell({ theme }: NotificationsBellProps) {
  const { pathname } = useLocation();
  const { data } = useUnreadNotificationsCount();
  const unreadCount = data?.count ?? 0;
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Al cerrar el panel el foco vuelve a la campana, salvo que se cierre por navegar.
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  // Ir a otra sección (ej. desde el buscador) cierra el panel sin devolver el foco.
  useEffect(() => {
    wasOpenRef.current = false;
    setIsOpen(false);
  }, [pathname]);

  const label = unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : "Notificaciones";

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        sx={{
          width: 42,
          height: 42,
          color: theme.actionColor,
          backgroundColor: isOpen ? theme.actionHoverBg : "transparent",
          "&:hover": { backgroundColor: theme.actionHoverBg },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          invisible={unreadCount === 0}
          max={NAV_BADGE_MAX}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: NAV_BADGE_COLOR,
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: 700,
              height: "16px",
              minWidth: "16px",
              padding: "0 3px",
            },
          }}
        >
          <Bell size={22} aria-hidden />
        </Badge>
      </IconButton>

      <NotificationsPanel
        open={isOpen}
        onClose={() => setIsOpen(false)}
        topOffset={TOPBAR_HEIGHT}
      />
    </>
  );
}
