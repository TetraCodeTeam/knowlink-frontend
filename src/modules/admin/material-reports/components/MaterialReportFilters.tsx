import { Box } from "@mui/material";
import type { AdminMaterialReportStatusCounts } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-status-counts.response";
import {
  filtersBarSx,
  scopeButtonActiveSx,
  scopeButtonSx,
  scopeToggleSx,
  statusTabActiveSx,
  statusTabCountSx,
  statusTabSx,
  statusTabsSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";
import type {
  AdminMaterialReportScope,
  AdminMaterialReportStatusFilter,
} from "@/modules/admin/types/admin-material-report-status.type";

interface MaterialReportFiltersProps {
  status: AdminMaterialReportStatusFilter;
  scope: AdminMaterialReportScope;
  statusCounts: AdminMaterialReportStatusCounts | undefined;
  onStatusChange: (status: AdminMaterialReportStatusFilter) => void;
  onScopeChange: (scope: AdminMaterialReportScope) => void;
}

interface StatusTab {
  value: AdminMaterialReportStatusFilter;
  label: string;
  count?: number;
}

export default function MaterialReportFilters({
  status,
  scope,
  statusCounts,
  onStatusChange,
  onScopeChange,
}: MaterialReportFiltersProps) {
  const tabs: StatusTab[] = [
    { value: "ALL", label: "Todo" },
    { value: "PENDING", label: "Pendiente", count: statusCounts?.pending ?? 0 },
    { value: "IN_REVIEW", label: "En revisión" },
    { value: "REMOVED", label: "Eliminado" },
    { value: "DISMISSED", label: "Desestimado" },
  ];

  return (
    <Box component="section" aria-label="Filtros de denuncias" sx={filtersBarSx}>
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
              {tab.value === "PENDING" ? (
                <>
                  <span>Pendiente</span>
                  <Box component="span" sx={statusTabCountSx}>
                    {tab.count}
                  </Box>
                </>
              ) : (
                tab.label
              )}
            </Box>
          );
        })}
      </Box>

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
  );
}
