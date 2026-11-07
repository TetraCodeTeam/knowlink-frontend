import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { ArrowLeftRight, ChevronDown, LogOut, UserRound, Zap } from "lucide-react";
import { useCurrentUser } from "@/modules/app-shell/hooks/useCurrentUser";
import { useRoleSwitch } from "@/modules/app-shell/hooks/useRoleSwitch";
import type { NavTheme } from "@/modules/app-shell/interfaces/navigation.interface";
import LogoutDialog from "@/modules/auth/logout/components/LogoutDialog";
import { useLogout } from "@/modules/auth/logout/hooks/useLogout";
import StudentRoleRedirectDialog from "@/modules/student/dual-role/components/RoleRedirectDialog";
import TutorRoleRedirectDialog from "@/modules/tutor/dual-role/components/RoleRedirectDialog";

interface UserMenuProps {
  theme: NavTheme;
  /** Sin perfil propio (admin) no se muestra "Mi perfil". */
  profilePath?: string;
}

const ROLE_LABEL = {
  STUDENT: "Modo alumno",
  TUTOR: "Modo tutor",
  ADMIN: "Administrador",
} as const;

const menuPaperSx = {
  marginTop: "8px",
  minWidth: 272,
  borderRadius: "14px",
  border: "1px solid #E8E8F0",
  boxShadow: "0 12px 32px rgba(24, 27, 52, 0.14)",
} as const;

export default function UserMenu({ theme, profilePath }: UserMenuProps) {
  const user = useCurrentUser();
  const roleSwitch = useRoleSwitch();
  const { triggerLogout, isPending: isLoggingOut } = useLogout();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const closeMenu = () => setAnchorEl(null);
  const initial = user.displayName.trim().charAt(0).toUpperCase() || "U";
  const { target } = roleSwitch;

  const handleSwitch = () => {
    closeMenu();
    void roleSwitch.switchRole();
  };

  const handleLogout = () => {
    closeMenu();
    setIsLogoutOpen(true);
  };

  return (
    <>
      <ButtonBase
        aria-label="Menú de usuario"
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: { xs: "4px", sm: "4px 8px 4px 4px" },
          borderRadius: "999px",
          fontFamily: "inherit",
          color: theme.actionColor,
          backgroundColor: anchorEl ? theme.actionHoverBg : "transparent",
          "&:hover": { backgroundColor: theme.actionHoverBg },
          "&.Mui-focusVisible": { outline: "2px solid currentColor", outlineOffset: "2px" },
        }}
      >
        <Avatar
          src={user.pictureUrl ?? undefined}
          alt=""
          sx={{
            width: 36,
            height: 36,
            fontSize: "15px",
            fontWeight: 600,
            backgroundColor: theme.avatarBg,
            color: theme.avatarText,
          }}
        >
          {initial}
        </Avatar>
        <Typography
          noWrap
          sx={{
            display: { xs: "none", md: "block" },
            maxWidth: 160,
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: 600,
            color: "inherit",
          }}
        >
          {user.displayName}
        </Typography>
        <Box component="span" sx={{ display: { xs: "none", sm: "flex" } }}>
          <ChevronDown size={16} aria-hidden />
        </Box>
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: menuPaperSx } }}
      >
        <Box role="presentation" sx={{ padding: "12px 16px" }}>
          <Typography noWrap sx={{ fontSize: "15px", fontWeight: 700, color: "#1A1A2E" }}>
            {user.displayName}
          </Typography>
          {user.email && (
            <Typography noWrap sx={{ fontSize: "13px", color: "#6B6B80" }}>
              {user.email}
            </Typography>
          )}
          {user.role && (
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                marginTop: "8px",
                padding: "2px 10px",
                borderRadius: "999px",
                backgroundColor: "#EDEBFA",
                color: "#3F4CAE",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {ROLE_LABEL[user.role]}
            </Typography>
          )}
        </Box>
        <Divider />
        {profilePath && (
          <MenuItem component={RouterLink} to={profilePath} onClick={closeMenu}>
            <ListItemIcon>
              <UserRound size={18} aria-hidden />
            </ListItemIcon>
            Mi perfil
          </MenuItem>
        )}
        {target && user.hasOtherRole === true && (
          <MenuItem onClick={handleSwitch} disabled={roleSwitch.isSwitching}>
            <ListItemIcon>
              <ArrowLeftRight size={18} aria-hidden />
            </ListItemIcon>
            Cambiar a modo {target.label}
          </MenuItem>
        )}
        {target && user.hasOtherRole === false && (
          <MenuItem component={RouterLink} to={target.activationPath} onClick={closeMenu}>
            <ListItemIcon>
              <Zap size={18} aria-hidden />
            </ListItemIcon>
            Activar rol de {target.label.toLowerCase()}
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={18} aria-hidden />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>

      <LogoutDialog
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => triggerLogout()}
        isPending={isLoggingOut}
      />

      {user.role === "STUDENT" && (
        <StudentRoleRedirectDialog
          open={roleSwitch.isRedirectDialogOpen}
          variant="switch"
          onRedirect={roleSwitch.completeSwitch}
        />
      )}
      {user.role === "TUTOR" && (
        <TutorRoleRedirectDialog
          open={roleSwitch.isRedirectDialogOpen}
          variant="switch"
          onRedirect={roleSwitch.completeSwitch}
        />
      )}
    </>
  );
}
