import type { ReactNode } from "react";
import { Box } from "@mui/material";
import type { AdminListScope } from "@/modules/admin/types/admin-list-scope.type";
import {
  filtersActionsSx,
  filtersBarSx,
  scopeButtonActiveSx,
  scopeButtonSx,
  scopeToggleSx,
  statusTabActiveSx,
  statusTabCountSx,
  statusTabSx,
  statusTabsSx,
} from "@/modules/admin/styles/admin-list.styles";

export interface AdminListFilterTab<TValue extends string> {
  value: TValue;
  label: string;
  /** Si se define, se muestra el contador dentro de la pestaña. */
  count?: number;
}

interface AdminListFiltersProps<TValue extends string> {
  status: TValue;
  tabs: AdminListFilterTab<TValue>[];
  scope: AdminListScope;
  onStatusChange: (status: TValue) => void;
  onScopeChange: (scope: AdminListScope) => void;
  ariaLabel: string;
  /** Slot reservado para acciones como el filtro de fecha (sin definir). */
  trailingAction?: ReactNode;
}

export default function AdminListFilters<TValue extends string>({
  status,
  tabs,
  scope,
  onStatusChange,
  onScopeChange,
  ariaLabel,
  trailingAction,
}: AdminListFiltersProps<TValue>) {
  return (
    <Box component="section" aria-label={ariaLabel} sx={filtersBarSx}>
      <Box role="group" aria-label="Filtrar por estado" sx={statusTabsSx}>
        {tabs.map((tab) => {
          const active = status === tab.value;

          return (
            <Box
              key={tab.value}
              component="button"
              type="button"
              aria-pressed={active}
              onClick={() => onStatusChange(tab.value)}
              sx={{ ...statusTabSx, ...(active ? statusTabActiveSx : {}) }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Box component="span" sx={statusTabCountSx}>
                  {tab.count}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Box sx={filtersActionsSx}>
        {trailingAction}
        <Box role="group" aria-label="Filtrar por asignación" sx={scopeToggleSx}>
          <Box
            component="button"
            type="button"
            aria-pressed={scope === "all"}
            onClick={() => onScopeChange("all")}
            sx={{ ...scopeButtonSx, ...(scope === "all" ? scopeButtonActiveSx : {}) }}
          >
            Todas
          </Box>
          <Box
            component="button"
            type="button"
            aria-pressed={scope === "mine"}
            onClick={() => onScopeChange("mine")}
            sx={{ ...scopeButtonSx, ...(scope === "mine" ? scopeButtonActiveSx : {}) }}
          >
            Asignadas a mí
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
