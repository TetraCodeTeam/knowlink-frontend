import { useLocation } from "react-router-dom";
import { Box, ButtonBase, Divider, Tooltip } from "@mui/material";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import SidebarNavGroup from "@/modules/app-shell/components/SidebarNavGroup";
import type {
  NavBadgeCounts,
  NavigationConfig,
  NavItemConfig,
} from "@/modules/app-shell/interfaces/navigation.interface";

interface SidebarNavProps {
  navigation: NavigationConfig;
  badgeCounts: NavBadgeCounts;
  collapsed: boolean;
  /** Sin esta función no se muestra el botón de plegar (ej. dentro del cajón móvil). */
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}

export default function SidebarNav({
  navigation,
  badgeCounts,
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: SidebarNavProps) {
  const { pathname } = useLocation();
  const { theme, groups, footerGroup } = navigation;

  const isItemActive = (item: NavItemConfig) =>
    item.isActive
      ? item.isActive(pathname)
      : pathname === item.path || pathname.startsWith(`${item.path}/`);

  const toggleLabel = collapsed ? "Expandir menú" : "Contraer menú";
  const ToggleIcon = collapsed ? ChevronsRight : ChevronsLeft;

  return (
    <Box
      component="nav"
      aria-label={navigation.ariaLabel}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: collapsed ? "16px 10px" : "16px 12px",
        fontFamily: theme.fontFamily,
        color: theme.itemText,
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {groups.map((group, index) => (
          <SidebarNavGroup
            key={group.title ?? `group-${index}`}
            group={group}
            theme={theme}
            badgeCounts={badgeCounts}
            collapsed={collapsed}
            isFirst={index === 0}
            isItemActive={isItemActive}
            onNavigate={onNavigate}
          />
        ))}
      </Box>

      {footerGroup && (
        <Box sx={{ paddingTop: "12px" }}>
          <Divider sx={{ marginBottom: "12px", borderColor: theme.divider }} />
          <SidebarNavGroup
            group={footerGroup}
            theme={theme}
            badgeCounts={badgeCounts}
            collapsed={collapsed}
            isFirst
            isItemActive={isItemActive}
            onNavigate={onNavigate}
          />
        </Box>
      )}

      {onToggleCollapsed && (
        <Box sx={{ paddingTop: "12px" }}>
          <Tooltip title={toggleLabel} placement="right" arrow disableHoverListener={!collapsed}>
            <ButtonBase
              disableRipple
              onClick={onToggleCollapsed}
              aria-label={toggleLabel}
              aria-expanded={!collapsed}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: "12px",
                width: "100%",
                height: 40,
                padding: collapsed ? 0 : "0 12px",
                borderRadius: "10px",
                fontFamily: "inherit",
                fontSize: "13px",
                fontWeight: 500,
                color: theme.groupTitle,
                "&:hover": { backgroundColor: theme.itemHoverBg, color: theme.itemText },
                "&.Mui-focusVisible": { outline: "2px solid currentColor", outlineOffset: "2px" },
              }}
            >
              <ToggleIcon size={20} aria-hidden />
              {!collapsed && "Contraer menú"}
            </ButtonBase>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
