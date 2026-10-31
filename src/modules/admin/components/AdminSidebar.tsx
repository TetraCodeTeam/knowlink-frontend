import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { Box, ButtonBase, Divider, Link as MuiLink, Typography, alpha } from "@mui/material";
import { ADMIN_NAV_ITEMS, type AdminNavBadge } from "@/modules/admin/constants/admin-nav-items";
import AdminNavBadgeCounter from "@/modules/admin/navigation/components/AdminNavBadge";
import { useAdminNavigationBadges } from "@/modules/admin/navigation/hooks/useAdminNavigationBadges";
import type { AdminNavigationBadgesResponse } from "@/modules/admin/navigation/interfaces/responses/admin-navigation-badges.response";
import {
  ADMIN_SIDEBAR_ACTIVE_BG,
  ADMIN_SIDEBAR_FONT_FAMILY,
  ADMIN_SIDEBAR_HOVER_BG,
  ADMIN_TOKENS,
} from "@/modules/admin/styles/admin-tokens";
import LogoutDialog from "@/modules/auth/logout/components/LogoutDialog";
import { useLogout } from "@/modules/auth/logout/hooks/useLogout";

export const ADMIN_SIDEBAR_WIDTH = 114;

function getPendingCount(
  badge: AdminNavBadge | undefined,
  badges: AdminNavigationBadgesResponse | undefined
): number {
  if (!badge || !badges) return 0;
  return badge === "materialReports" ? badges.pendingMaterialReports : badges.pendingSessionClaims;
}

/** El conteo se anuncia en el nombre accesible del enlace; el badge visual es decorativo. */
function getLinkLabel(label: string, pending: number): string {
  if (pending === 0) return label;
  return `${label}: ${pending} ${pending === 1 ? "pendiente" : "pendientes"}`;
}

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { triggerLogout, isPending: isLoggingOut } = useLogout();
  const { badges } = useAdminNavigationBadges();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <Box
      component="nav"
      aria-label="Navegación del administrador"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: ADMIN_SIDEBAR_WIDTH,
        height: "100vh",
        backgroundColor: ADMIN_TOKENS.sidebarBg,
        fontFamily: ADMIN_SIDEBAR_FONT_FAMILY,
        paddingBottom: "24px",
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          paddingTop: "20px",
          paddingBottom: "24px",
        }}
      >
        <GraduationCap size={38} color={ADMIN_TOKENS.celeste} strokeWidth={2} />
        <Typography
          sx={{
            fontFamily: ADMIN_SIDEBAR_FONT_FAMILY,
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1,
            color: ADMIN_TOKENS.celeste,
            userSelect: "none",
          }}
        >
          KnowLink
        </Typography>
      </Box>

      {/* Nav items */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: "8px",
        }}
      >
        {ADMIN_NAV_ITEMS.map(({ label, path, icon: Icon, badge }) => {
          const active = isActive(path);
          const pending = getPendingCount(badge, badges);
          return (
            <MuiLink
              key={path}
              component={RouterLink}
              to={path}
              underline="none"
              aria-label={getLinkLabel(label, pending)}
              aria-current={active ? "page" : undefined}
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "110px",
                borderRadius: "8px",
                "&:hover .admin-nav-surface": {
                  backgroundColor: active ? ADMIN_SIDEBAR_ACTIVE_BG : ADMIN_SIDEBAR_HOVER_BG,
                },
              }}
            >
              <Box
                className="admin-nav-surface"
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  width: "102px",
                  minHeight: "76px",
                  padding: "6px 2px",
                  borderRadius: "8px",
                  backgroundColor: active ? ADMIN_SIDEBAR_ACTIVE_BG : "transparent",
                  transition: "background-color 0.15s ease",
                }}
              >
                {pending > 0 && <AdminNavBadgeCounter count={pending} />}
                <Icon size={40} color={ADMIN_TOKENS.fondo3} strokeWidth={active ? 2.2 : 1.8} />
                <Typography
                  sx={{
                    fontFamily: ADMIN_SIDEBAR_FONT_FAMILY,
                    fontSize: "15px",
                    fontWeight: active ? 600 : 400,
                    lineHeight: 1.15,
                    color: ADMIN_TOKENS.fondo3,
                    textAlign: "center",
                    maxWidth: "94px",
                    wordBreak: "break-word",
                    userSelect: "none",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </MuiLink>
          );
        })}
      </Box>

      <Box sx={{ flex: 1 }} />

      <Divider
        sx={{
          width: "79px",
          borderColor: alpha(ADMIN_TOKENS.fondo3, 0.24),
          marginBottom: "12px",
        }}
      />

      <ButtonBase
        onClick={() => setIsLogoutOpen(true)}
        aria-label="Salir"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "8px 16px",
          borderRadius: "8px",
          color: ADMIN_TOKENS.fondo3,
        }}
      >
        <LogOut size={24} />
        <Typography
          sx={{
            fontFamily: ADMIN_SIDEBAR_FONT_FAMILY,
            fontSize: "20px",
            lineHeight: 1,
            color: ADMIN_TOKENS.fondo3,
            userSelect: "none",
          }}
        >
          Salir
        </Typography>
      </ButtonBase>

      <LogoutDialog
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => triggerLogout()}
        isPending={isLoggingOut}
      />
    </Box>
  );
}
