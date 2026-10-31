import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  AdminSessionClaimFilters,
  AdminSessionClaimScope,
  AdminSessionClaimStatusFilter,
} from "@/modules/admin/types/admin-session-claim-filters.type";
import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";

const STATUS_VALUES: ClaimStatus[] = ["OPEN", "IN_REVIEW", "RESOLVED"];

function parseStatus(value: string | null): AdminSessionClaimStatusFilter {
  return STATUS_VALUES.includes(value as ClaimStatus) ? (value as ClaimStatus) : "ALL";
}

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

/**
 * Filtros, página y selección viven en la URL para permitir deep links,
 * refresco y navegación con "atrás". Nada de esto se guarda en Zustand.
 */
export function useSessionClaimsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = parseStatus(searchParams.get("status"));
  const scope: AdminSessionClaimScope = searchParams.get("scope") === "mine" ? "mine" : "all";
  const page = parsePage(searchParams.get("page"));
  const selectedClaimId = searchParams.get("selected");

  const filters = useMemo<AdminSessionClaimFilters>(
    () => ({ status, scope, page }),
    [status, scope, page]
  );

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        mutate(next);
        return next;
      });
    },
    [setSearchParams]
  );

  const setStatus = useCallback(
    (nextStatus: AdminSessionClaimStatusFilter) => {
      updateParams((params) => {
        if (nextStatus === "ALL") params.delete("status");
        else params.set("status", nextStatus);
        params.delete("page");
        params.delete("selected");
      });
    },
    [updateParams]
  );

  const setScope = useCallback(
    (nextScope: AdminSessionClaimScope) => {
      updateParams((params) => {
        if (nextScope === "mine") params.set("scope", "mine");
        else params.delete("scope");
        params.delete("page");
        params.delete("selected");
      });
    },
    [updateParams]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      updateParams((params) => {
        if (nextPage <= 1) params.delete("page");
        else params.set("page", String(nextPage));
        params.delete("selected");
      });
    },
    [updateParams]
  );

  const selectClaim = useCallback(
    (claimId: string | null) => {
      updateParams((params) => {
        if (claimId) params.set("selected", claimId);
        else params.delete("selected");
      });
    },
    [updateParams]
  );

  return {
    filters,
    selectedClaimId,
    setStatus,
    setScope,
    setPage,
    selectClaim,
    clearSelection: () => selectClaim(null),
  };
}
