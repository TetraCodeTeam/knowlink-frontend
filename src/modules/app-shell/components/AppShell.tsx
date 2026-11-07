import type { ReactNode } from "react";
import { Box, Drawer } from "@mui/material";
import AppTopbar from "@/modules/app-shell/components/AppTopbar";
import SidebarNav from "@/modules/app-shell/components/SidebarNav";
import {
  LAYOUT_Z_INDEX,
  SIDEBAR_DRAWER_WIDTH,
  TOPBAR_HEIGHT,
} from "@/modules/app-shell/constants/navigation.constants";
import { useSidebarState } from "@/modules/app-shell/hooks/useSidebarState";
import type {
  NavBadgeCounts,
  NavigationConfig,
} from "@/modules/app-shell/interfaces/navigation.interface";

interface AppShellProps {
  navigation: NavigationConfig;
  badgeCounts?: NavBadgeCounts;
  showNotifications?: boolean;
  profilePath?: string;
  searchSlot?: ReactNode;
  topbarLabel?: string;
  /** Contenido de la página (normalmente el `<Outlet />` del layout del rol). */
  children: ReactNode;
}

const NO_BADGES: NavBadgeCounts = {};

const motionSx = {
  transition: "width 0.2s ease, margin-left 0.2s ease",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
} as const;

/**
 * Estructura común de los tres roles: topbar fijo arriba, menú lateral y contenido.
 * Cada rol aporta su configuración de navegación y sus colores; la estructura es la misma.
 */
export default function AppShell({
  navigation,
  badgeCounts = NO_BADGES,
  showNotifications = false,
  profilePath,
  searchSlot,
  topbarLabel,
  children,
}: AppShellProps) {
  const sidebar = useSidebarState();
  const { theme } = navigation;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // El espacio del topbar fijo va como relleno: con `margin-top` en el contenido, el margen
        // se escapaba al contenedor y la página quedaba 64px más alta que la ventana.
        boxSizing: "border-box",
        paddingTop: `${TOPBAR_HEIGHT}px`,
        backgroundColor: theme.contentBg,
        fontFamily: theme.contentFontFamily,
      }}
    >
      <AppTopbar
        navigation={navigation}
        isCompact={sidebar.isCompact}
        collapsed={sidebar.collapsed}
        sidebarWidth={sidebar.sidebarWidth}
        onOpenMenu={sidebar.openDrawer}
        showNotifications={showNotifications}
        profilePath={profilePath}
        searchSlot={searchSlot}
        label={topbarLabel}
      />

      {sidebar.isCompact ? (
        <Drawer
          open={sidebar.isDrawerOpen}
          onClose={sidebar.closeDrawer}
          slotProps={{
            paper: {
              sx: {
                top: TOPBAR_HEIGHT,
                height: `calc(100% - ${TOPBAR_HEIGHT}px)`,
                width: SIDEBAR_DRAWER_WIDTH,
                maxWidth: "85vw",
                backgroundColor: theme.sidebarBg,
              },
            },
          }}
        >
          <SidebarNav
            navigation={navigation}
            badgeCounts={badgeCounts}
            collapsed={false}
            onNavigate={sidebar.closeDrawer}
          />
        </Drawer>
      ) : (
        <Box
          sx={{
            position: "fixed",
            top: TOPBAR_HEIGHT,
            bottom: 0,
            left: 0,
            width: sidebar.sidebarWidth,
            backgroundColor: theme.sidebarBg,
            borderRight: `1px solid ${theme.sidebarBorder}`,
            zIndex: LAYOUT_Z_INDEX.sidebar,
            overflow: "hidden",
            ...motionSx,
          }}
        >
          <SidebarNav
            navigation={navigation}
            badgeCounts={badgeCounts}
            collapsed={sidebar.collapsed}
            onToggleCollapsed={sidebar.toggleCollapsed}
          />
        </Box>
      )}

      <Box
        component="main"
        sx={{
          minWidth: 0,
          marginLeft: `${sidebar.sidebarWidth}px`,
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          ...motionSx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
