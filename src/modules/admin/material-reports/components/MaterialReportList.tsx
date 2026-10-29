import { Box, Skeleton, Typography } from "@mui/material";
import { FileText } from "lucide-react";
import EmptyState from "@/shared/components/EmptyState";
import MaterialReportListItem from "@/modules/admin/material-reports/components/MaterialReportListItem";
import { MATERIAL_REPORT_MESSAGES } from "@/modules/admin/material-reports/constants/material-reports.constants";
import type { AdminMaterialReportListItem as AdminMaterialReportListItemResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";
import {
  listCardSx,
  listEmptySx,
  listHeaderCountSx,
  listHeaderSx,
  listHeaderTitleSx,
  listSx,
  paginationButtonActiveSx,
  paginationButtonSx,
  paginationControlsSx,
  paginationSx,
  paginationTextSx,
  skeletonStackSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";
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
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const firstItem = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalElements);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

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
        <Box sx={listEmptySx}>
          <EmptyState
            icon={<FileText size={38} color={ADMIN_TOKENS.slate400} aria-hidden="true" />}
            message={MATERIAL_REPORT_MESSAGES.emptyList}
          />
        </Box>
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

          <Box sx={paginationSx}>
            <Typography sx={paginationTextSx}>
              Mostrando {firstItem}–{lastItem} de {totalElements} archivos
            </Typography>

            <Box sx={paginationControlsSx}>
              <Box
                component="button"
                type="button"
                aria-label="Página anterior"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                sx={paginationButtonSx}
              >
                «
              </Box>

              {pages.map((pageNumber) => (
                <Box
                  key={pageNumber}
                  component="button"
                  type="button"
                  aria-label={`Página ${pageNumber}`}
                  aria-current={pageNumber === page ? "page" : undefined}
                  onClick={() => onPageChange(pageNumber)}
                  sx={{
                    ...paginationButtonSx,
                    ...(pageNumber === page ? paginationButtonActiveSx : {}),
                  }}
                >
                  {pageNumber}
                </Box>
              ))}

              <Box
                component="button"
                type="button"
                aria-label="Página siguiente"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                sx={paginationButtonSx}
              >
                »
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
