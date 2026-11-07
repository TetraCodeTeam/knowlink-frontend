import { Link as RouterLink } from "react-router-dom";
import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";
import NavBadge from "@/modules/app-shell/components/NavBadge";
import { NAV_BADGE_DESCRIPTION } from "@/modules/app-shell/constants/navigation.constants";
import type { NavItemConfig, NavTheme } from "@/modules/app-shell/interfaces/navigation.interface";

interface SidebarNavItemProps {
  item: NavItemConfig;
  theme: NavTheme;
  active: boolean;
  count: number;
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function SidebarNavItem({
  item,
  theme,
  active,
  count,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  const { label, path, icon: Icon, badge } = item;
  const accessibleName =
    badge && count > 0 ? `${label}: ${NAV_BADGE_DESCRIPTION[badge](count)}` : label;

  const link = (
    <ButtonBase
      component={RouterLink}
      to={path}
      disableRipple
      aria-label={accessibleName}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: "12px",
        width: "100%",
        // Un nombre largo pasa a dos líneas en vez de cortarse con puntos suspensivos.
        minHeight: 44,
        padding: collapsed ? 0 : "6px 12px",
        borderRadius: "10px",
        fontFamily: "inherit",
        color: active ? theme.itemActiveText : theme.itemText,
        backgroundColor: active ? theme.itemActiveBg : "transparent",
        transition: "background-color 0.15s ease",
        "&:hover": { backgroundColor: active ? theme.itemActiveBg : theme.itemHoverBg },
        "&.Mui-focusVisible": { outline: "2px solid currentColor", outlineOffset: "2px" },
      }}
    >
      <Box sx={{ position: "relative", display: "flex", flexShrink: 0 }}>
        <Icon size={20} strokeWidth={active ? 2.4 : 2} aria-hidden />
        {collapsed && badge && <NavBadge count={count} floating />}
      </Box>
      {!collapsed && (
        <>
          <Typography
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              textAlign: "left",
              fontFamily: "inherit",
              fontSize: "14px",
              lineHeight: 1.25,
              fontWeight: active ? 600 : 500,
              color: "inherit",
              userSelect: "none",
            }}
          >
            {label}
          </Typography>
          {badge && <NavBadge count={count} />}
        </>
      )}
    </ButtonBase>
  );

  return (
    <Box component="li" sx={{ listStyle: "none" }}>
      {collapsed ? (
        <Tooltip title={label} placement="right" arrow>
          {link}
        </Tooltip>
      ) : (
        link
      )}
    </Box>
  );
}
