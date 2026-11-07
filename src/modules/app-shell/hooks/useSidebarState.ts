import { useCallback, useState } from "react";
import { useMediaQuery } from "@mui/material";
import {
  COMPACT_VIEWPORT_QUERY,
  SIDEBAR_AUTO_EXPAND_QUERY,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/modules/app-shell/constants/navigation.constants";

/** La preferencia guardada manda; sin ella decide el ancho de la ventana. */
function readStoredPreference(): boolean | null {
  try {
    const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // El almacenamiento puede estar bloqueado: el menú sigue funcionando sin recordar.
  }
  return null;
}

function storePreference(collapsed: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed));
  } catch {
    // Ver readStoredPreference.
  }
}

export function useSidebarState() {
  const isCompact = useMediaQuery(COMPACT_VIEWPORT_QUERY, { noSsr: true });
  const isWide = useMediaQuery(SIDEBAR_AUTO_EXPAND_QUERY, { noSsr: true });
  const [preference, setPreference] = useState<boolean | null>(readStoredPreference);
  const [drawerRequested, setDrawerRequested] = useState(false);

  const collapsed = preference ?? !isWide;

  const toggleCollapsed = useCallback(() => {
    setPreference(!collapsed);
    storePreference(!collapsed);
  }, [collapsed]);

  const openDrawer = useCallback(() => setDrawerRequested(true), []);
  const closeDrawer = useCallback(() => setDrawerRequested(false), []);

  return {
    isCompact,
    collapsed,
    /** Ancho que ocupa el menú fijo; en pantallas chicas no ocupa lugar. */
    sidebarWidth: isCompact ? 0 : collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
    toggleCollapsed,
    /** El cajón solo existe en pantallas chicas, aunque quedara pedido al agrandar la ventana. */
    isDrawerOpen: isCompact && drawerRequested,
    openDrawer,
    closeDrawer,
  };
}
