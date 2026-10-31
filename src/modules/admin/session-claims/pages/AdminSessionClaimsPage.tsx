import { Box, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import AdminListFilters, {
  type AdminListFilterTab,
} from "@/modules/admin/components/AdminListFilters";
import { ADMIN_LIST_PAGE_SIZE } from "@/modules/admin/constants/admin-pagination.constants";
import SessionClaimDetailPanel from "@/modules/admin/session-claims/components/SessionClaimDetailPanel";
import SessionClaimList from "@/modules/admin/session-claims/components/SessionClaimList";
import { SESSION_CLAIM_MESSAGES } from "@/modules/admin/session-claims/constants/session-claims.constants";
import { useAdminSessionClaims } from "@/modules/admin/session-claims/hooks/useAdminSessionClaims";
import { useSessionClaimsFilters } from "@/modules/admin/session-claims/hooks/useSessionClaimsFilters";
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
} from "@/modules/admin/styles/admin-list.styles";
import type { AdminSessionClaimStatusFilter } from "@/modules/admin/types/admin-session-claim-filters.type";

export default function AdminSessionClaimsPage() {
  const { filters, selectedClaimId, setStatus, setScope, setPage, selectClaim } =
    useSessionClaimsFilters();
  const { items, statusCounts, totalElements, isLoading, isError, refetch } =
    useAdminSessionClaims(filters);

  const showListError = isError && items.length === 0;

  const tabs: AdminListFilterTab<AdminSessionClaimStatusFilter>[] = [
    { value: "ALL", label: "Todo" },
    { value: "OPEN", label: "Pendiente", count: statusCounts?.open ?? 0 },
    { value: "IN_REVIEW", label: "En revisión" },
    { value: "RESOLVED", label: "Resuelto" },
  ];

  return (
    <Box sx={pageSx}>
      <Box component="header" sx={headerSx}>
        <Typography component="h1" sx={titleSx}>
          Reclamos de sesiones
        </Typography>
        <Typography sx={subtitleSx}>
          Gestioná, auditá y mediá disputas entre tutores y alumnos por sesiones no dictadas,
          desconexiones o desacuerdos de servicio.
        </Typography>
      </Box>

      <AdminListFilters
        status={filters.status}
        tabs={tabs}
        scope={filters.scope}
        onStatusChange={setStatus}
        onScopeChange={setScope}
        ariaLabel="Filtros de reclamos"
      />

      {showListError ? (
        <Box sx={listCardSx}>
          <Box role="alert" sx={detailErrorSx}>
            <Typography sx={detailErrorTitleSx}>{SESSION_CLAIM_MESSAGES.listErrorTitle}</Typography>
            <Typography sx={detailErrorTextSx}>{SESSION_CLAIM_MESSAGES.listErrorText}</Typography>
            <AppButton appVariant="dark" onClick={() => void refetch()}>
              Reintentar
            </AppButton>
          </Box>
        </Box>
      ) : (
        <Box sx={contentGridSx}>
          <SessionClaimList
            claims={items}
            totalElements={totalElements}
            page={filters.page}
            pageSize={ADMIN_LIST_PAGE_SIZE}
            selectedClaimId={selectedClaimId}
            isLoading={isLoading}
            onSelect={selectClaim}
            onPageChange={setPage}
          />
          <SessionClaimDetailPanel claimId={selectedClaimId} />
        </Box>
      )}
    </Box>
  );
}
