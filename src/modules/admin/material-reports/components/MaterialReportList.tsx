import { Box, Skeleton, Typography } from "@mui/material";
import { FileText } from "lucide-react";
import AdminListEmptyState from "@/modules/admin/components/AdminListEmptyState";
import AdminPagination from "@/modules/admin/components/AdminPagination";
import MaterialReportListItem from "@/modules/admin/material-reports/components/MaterialReportListItem";
import { MATERIAL_REPORT_MESSAGES } from "@/modules/admin/material-reports/constants/material-reports.constants";
import type { AdminMaterialReportListItem as AdminMaterialReportListItemResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";
import {
  listCardSx,
  listHeaderCountSx,
  listHeaderSx,
  listHeaderTitleSx,
  listSx,
  skeletonStackSx,
} from "@/modules/admin/styles/admin-list.styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

interface MaterialReportListProps {
  reports: AdminMaterialReportListItemResponse[];
  totalElements: number;
  page: number;
  pageSize: number;
  selectedMaterialId: string | null;
  isLoading: boolean;
  onSelect: (materialId: string) => void;
  onPageChange: (page: number) => void;
}

export default function MaterialReportList({
  reports,
  totalElements,
  page,
  pageSize,
  selectedMaterialId,
  isLoading,
  onSelect,
  onPageChange,
}: MaterialReportListProps) {
  return (
    <Box component="section" aria-label="Archivos denunciados" sx={listCardSx}>
      <Box sx={listHeaderSx}>
        <Typography component="h2" sx={listHeaderTitleSx}>
          Denuncias por archivo
        </Typography>
        <Typography sx={listHeaderCountSx}>
          {totalElements} {totalElements === 1 ? "archivo" : "archivos"}
        </Typography>
      </Box>

      {isLoading && reports.length === 0 ? (
        <Box sx={skeletonStackSx} aria-label="Cargando denuncias">
          {Array.from({ length: pageSize }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={88} />
          ))}
        </Box>
      ) : reports.length === 0 ? (
        <AdminListEmptyState
          message={MATERIAL_REPORT_MESSAGES.emptyList}
          icon={<FileText size={38} color={ADMIN_TOKENS.slate400} aria-hidden="true" />}
        />
      ) : (
        <>
          <Box component="ul" sx={listSx}>
            {reports.map((report) => (
              <MaterialReportListItem
                key={report.materialId}
                report={report}
                selected={report.materialId === selectedMaterialId}
                onSelect={onSelect}
              />
            ))}
          </Box>

          <AdminPagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            noun="archivos"
            onPageChange={onPageChange}
          />
        </>
      )}
    </Box>
  );
}
