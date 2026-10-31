import { Box, Typography } from "@mui/material";
import {
  paginationButtonActiveSx,
  paginationButtonSx,
  paginationControlsSx,
  paginationSx,
  paginationTextSx,
} from "@/modules/admin/styles/admin-list.styles";

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  /** Sustantivo del pie: "reclamos", "archivos", etc. */
  noun: string;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  page,
  pageSize,
  totalElements,
  noun,
  onPageChange,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const firstItem = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalElements);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Box sx={paginationSx}>
      <Typography sx={paginationTextSx}>
        Mostrando {firstItem}–{lastItem} de {totalElements} {noun}
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
          ‹
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
          ›
        </Box>
      </Box>
    </Box>
  );
}
