import { Box } from "@mui/material";
import { ADMIN_SIDEBAR_FONT_FAMILY, ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

interface AdminNavBadgeProps {
  count: number;
}

const MAX_DISPLAYED_COUNT = 99;

/**
 * Contador numérico superpuesto al ícono del ítem del sidebar.
 * Es decorativo: el conteo se anuncia en el `aria-label` del enlace.
 */
export default function AdminNavBadge({ count }: AdminNavBadgeProps) {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        position: "absolute",
        top: "6px",
        right: "8px",
        minWidth: "20px",
        height: "20px",
        padding: "0 5px",
        borderRadius: "10px",
        backgroundColor: ADMIN_TOKENS.rose500,
        color: "#FFFFFF",
        fontFamily: ADMIN_SIDEBAR_FONT_FAMILY,
        fontSize: "11px",
        fontWeight: 700,
        lineHeight: "20px",
        textAlign: "center",
      }}
    >
      {count > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : count}
    </Box>
  );
}
