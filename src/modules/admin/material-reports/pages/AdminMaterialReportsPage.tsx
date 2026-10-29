import { Box, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import MaterialReportDetailPanel from "@/modules/admin/material-reports/components/MaterialReportDetailPanel";
import MaterialReportFilters from "@/modules/admin/material-reports/components/MaterialReportFilters";
import MaterialReportList from "@/modules/admin/material-reports/components/MaterialReportList";
import { MATERIAL_REPORT_MESSAGES } from "@/modules/admin/material-reports/constants/material-reports.constants";
import { useAdminMaterialReports } from "@/modules/admin/material-reports/hooks/useAdminMaterialReports";
import { useMaterialReportsFilters } from "@/modules/admin/material-reports/hooks/useMaterialReportsFilters";
import {
  contentGridSx,
  detailErrorSx,
  detailErrorTextSx,
  detailErrorTitleSx,
  headerSx,
  listCardSx,
  pageSx,
  subtitleSx,
  titleSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";
import { ADMIN_LIST_PAGE_SIZE } from "@/modules/admin/constants/admin-pagination.constants";

export default function AdminMaterialReportsPage() {
  const { filters, selectedMaterialId, setStatus, setScope, setPage, selectMaterial } =
    useMaterialReportsFilters();
  const { items, statusCounts, totalElements, isLoading, isError, refetch } =
    useAdminMaterialReports(filters);

  const showListError = isError && items.length === 0;

  return (
    <Box sx={pageSx}>
      <Box component="header" sx={headerSx}>
        <Typography component="h1" sx={titleSx}>
          Denuncias de material
        </Typography>
        <Typography sx={subtitleSx}>
          Revisá, auditá y resolvé reportes de material académico infractor, duplicado o inapropiado
          subido por la comunidad.
        </Typography>
      </Box>

      <MaterialReportFilters
        status={filters.status}
        scope={filters.scope}
        statusCounts={statusCounts}
        onStatusChange={setStatus}
        onScopeChange={setScope}
      />

      {showListError ? (
        <Box sx={listCardSx}>
          <Box role="alert" sx={detailErrorSx}>
            <Typography sx={detailErrorTitleSx}>
              {MATERIAL_REPORT_MESSAGES.listErrorTitle}
            </Typography>
            <Typography sx={detailErrorTextSx}>{MATERIAL_REPORT_MESSAGES.listErrorText}</Typography>
            <AppButton appVariant="dark" onClick={() => void refetch()}>
              Reintentar
            </AppButton>
          </Box>
        </Box>
      ) : (
        <Box sx={contentGridSx}>
          <MaterialReportList
            reports={items}
            totalElements={totalElements}
            page={filters.page}
            pageSize={ADMIN_LIST_PAGE_SIZE}
            selectedMaterialId={selectedMaterialId}
            isLoading={isLoading}
            onSelect={selectMaterial}
            onPageChange={setPage}
          />
          <MaterialReportDetailPanel materialId={selectedMaterialId} />
        </Box>
      )}
    </Box>
  );
}
