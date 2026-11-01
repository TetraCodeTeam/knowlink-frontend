import AdminListFilters, {
  type AdminListFilterTab,
} from "@/modules/admin/components/AdminListFilters";
import type { AdminMaterialReportStatusCounts } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-status-counts.response";
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

export default function MaterialReportFilters({
  status,
  scope,
  statusCounts,
  onStatusChange,
  onScopeChange,
}: MaterialReportFiltersProps) {
  const tabs: AdminListFilterTab<AdminMaterialReportStatusFilter>[] = [
    { value: "ALL", label: "Todo" },
    { value: "PENDING", label: "Pendiente", count: statusCounts?.pending ?? 0 },
    { value: "IN_REVIEW", label: "En revisión" },
    { value: "REMOVED", label: "Eliminado" },
    { value: "DISMISSED", label: "Desestimado" },
  ];

  return (
    <AdminListFilters
      status={status}
      tabs={tabs}
      scope={scope}
      onStatusChange={onStatusChange}
      onScopeChange={onScopeChange}
      ariaLabel="Filtros de denuncias"
    />
  );
}
