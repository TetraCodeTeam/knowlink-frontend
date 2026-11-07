import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "lucide-react";
import NotificationsBell from "@/modules/app-shell/components/NotificationsBell";
import UserMenu from "@/modules/app-shell/components/UserMenu";
import {
  BRAND_LOGO_IN_TILE_SIZE,
  BRAND_LOGO_SIZE,
  BRAND_LOGO_TILE_SIZE,
  LAYOUT_Z_INDEX,
  TOPBAR_HEIGHT,
} from "@/modules/app-shell/constants/navigation.constants";
import type { NavigationConfig } from "@/modules/app-shell/interfaces/navigation.interface";
import Frankie from "@/shared/frankie/Frankie";

interface AppTopbarProps {
  navigation: NavigationConfig;
  isCompact: boolean;
  collapsed: boolean;
  sidebarWidth: number;
  onOpenMenu: () => void;
  showNotifications: boolean;
  profilePath?: string;
  /** Buscador u otro control central (hoy solo el alumno). */
  searchSlot?: ReactNode;
  /** Texto de contexto cuando no hay buscador (ej. "Panel de administración"). */
  label?: string;
}

export default function AppTopbar({
  navigation,
  isCompact,
  collapsed,
  sidebarWidth,
  onOpenMenu,
  showNotifications,
  profilePath,
  searchSlot,
  label,
}: AppTopbarProps) {
  const { theme } = navigation;
  // El logo ocupa el mismo ancho que el menú, así la esquina superior izquierda se lee como un marco.
  const isRail = !isCompact && collapsed;

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: TOPBAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.topbarBg,
        borderBottom: `1px solid ${theme.topbarBorder}`,
        fontFamily: theme.fontFamily,
        zIndex: LAYOUT_Z_INDEX.topbar,
      }}
    >
      {isCompact && (
        <IconButton
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          onClick={onOpenMenu}
          sx={{
            marginLeft: "8px",
            color: theme.actionColor,
            "&:hover": { backgroundColor: theme.actionHoverBg },
          }}
        >
          <MenuIcon size={22} aria-hidden />
        </IconButton>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isRail ? "center" : "flex-start",
          flexShrink: 0,
          width: isCompact ? "auto" : sidebarWidth,
          paddingLeft: isCompact ? "4px" : isRail ? 0 : "20px",
          transition: "width 0.2s ease",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <ButtonBase
          component={RouterLink}
          to={navigation.homePath}
          aria-label="KnowLink, ir al inicio"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "6px",
            borderRadius: "10px",
            fontFamily: "inherit",
            "&.Mui-focusVisible": { outline: `2px solid ${theme.brandText}`, outlineOffset: "2px" },
          }}
        >
          {/* Frankie es el logo de KnowLink: quieto y sin accesorios, el movimiento queda para los avisos. */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ...(theme.logoBg && {
                width: BRAND_LOGO_TILE_SIZE,
                height: BRAND_LOGO_TILE_SIZE,
                borderRadius: "14px",
                backgroundColor: theme.logoBg,
              }),
            }}
          >
            <Frankie
              size={theme.logoBg ? BRAND_LOGO_IN_TILE_SIZE : BRAND_LOGO_SIZE}
              accessories={[]}
              animated={false}
            />
          </Box>
          {!isRail && (
            <Typography
              component="span"
              sx={{
                display: isCompact ? { xs: "none", sm: "block" } : "block",
                fontFamily: "inherit",
                fontSize: "21px",
                fontWeight: 600,
                letterSpacing: "-0.4px",
                color: theme.brandText,
              }}
            >
              KnowLink
            </Typography>
          )}
        </ButtonBase>
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: searchSlot ? "center" : "flex-start",
          padding: { xs: "0 8px", md: "0 28px" },
        }}
      >
        {searchSlot ??
          (label && (
            <Typography
              noWrap
              sx={{
                display: { xs: "none", sm: "block" },
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: 500,
                color: theme.groupTitle,
              }}
            >
              {label}
            </Typography>
          ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0,
          paddingRight: { xs: "8px", md: "20px" },
        }}
      >
        {showNotifications && <NotificationsBell theme={theme} />}
        <UserMenu theme={theme} profilePath={profilePath} />
      </Box>
    </Box>
  );
}
