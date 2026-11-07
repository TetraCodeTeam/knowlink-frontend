import { Box } from "@mui/material";
import { NAV_BADGE_COLOR, NAV_BADGE_MAX } from "@/modules/app-shell/constants/navigation.constants";

interface NavBadgeProps {
  count: number;
  /** Sobre la esquina del ícono (menú plegado) en vez de alineado a la derecha. */
  floating?: boolean;
}

/** Contador decorativo: el valor lo anuncia el nombre accesible del ítem. */
export default function NavBadge({ count, floating = false }: NavBadgeProps) {
  if (count <= 0) return null;

  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 5px",
        borderRadius: "9px",
        backgroundColor: NAV_BADGE_COLOR,
        color: "#FFFFFF",
        fontSize: "11px",
        fontWeight: 700,
        lineHeight: 1,
        ...(floating && { position: "absolute", top: -7, right: -9 }),
      }}
    >
      {count > NAV_BADGE_MAX ? `${NAV_BADGE_MAX}+` : count}
    </Box>
  );
}
