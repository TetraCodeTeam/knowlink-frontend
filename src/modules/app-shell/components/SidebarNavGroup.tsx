import { Box, Divider, Typography } from "@mui/material";
import SidebarNavItem from "@/modules/app-shell/components/SidebarNavItem";
import type {
  NavBadgeCounts,
  NavGroupConfig,
  NavItemConfig,
  NavTheme,
} from "@/modules/app-shell/interfaces/navigation.interface";

interface SidebarNavGroupProps {
  group: NavGroupConfig;
  theme: NavTheme;
  badgeCounts: NavBadgeCounts;
  collapsed: boolean;
  /** El primer grupo no lleva separación superior. */
  isFirst?: boolean;
  isItemActive: (item: NavItemConfig) => boolean;
  onNavigate?: () => void;
}

export default function SidebarNavGroup({
  group,
  theme,
  badgeCounts,
  collapsed,
  isFirst = false,
  isItemActive,
  onNavigate,
}: SidebarNavGroupProps) {
  const { title, items } = group;

  return (
    <Box sx={{ marginTop: isFirst ? 0 : collapsed ? "8px" : "20px" }}>
      {title && !collapsed && (
        <Typography
          component="h2"
          sx={{
            padding: "0 12px",
            marginBottom: "6px",
            fontFamily: "inherit",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: theme.groupTitle,
            userSelect: "none",
          }}
        >
          {title}
        </Typography>
      )}
      {/* En el riel no hay lugar para el título: un separador marca el cambio de grupo. */}
      {title && collapsed && !isFirst && (
        <Divider sx={{ margin: "0 12px 8px", borderColor: theme.divider }} />
      )}
      <Box
        component="ul"
        aria-label={title}
        sx={{ display: "flex", flexDirection: "column", gap: "4px", margin: 0, padding: 0 }}
      >
        {items.map((item) => (
          <SidebarNavItem
            key={item.path}
            item={item}
            theme={theme}
            active={isItemActive(item)}
            count={item.badge ? (badgeCounts[item.badge] ?? 0) : 0}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </Box>
    </Box>
  );
}
