import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  AdminMaterialReportScope,
  AdminMaterialReportStatus,
  AdminMaterialReportStatusFilter,
} from "@/modules/admin/types/admin-material-report-status.type";

const STATUS_VALUES: AdminMaterialReportStatus[] = ["PENDING", "IN_REVIEW", "REMOVED", "DISMISSED"];

function parseStatus(value: string | null): AdminMaterialReportStatusFilter {
  return STATUS_VALUES.includes(value as AdminMaterialReportStatus)
    ? (value as AdminMaterialReportStatus)
    : "ALL";
}

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

/**
 * Filtros, página y selección viven en la URL para permitir deep links,
 * refresco y navegación con "atrás". Nada de esto se guarda en Zustand.
 */
export function useMaterialReportsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = parseStatus(searchParams.get("status"));
  const scope: AdminMaterialReportScope = searchParams.get("scope") === "mine" ? "mine" : "all";
  const page = parsePage(searchParams.get("page"));
  const selectedMaterialId = searchParams.get("selected");

  const filters = useMemo(() => ({ status, scope, page }), [status, scope, page]);

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
    (nextStatus: AdminMaterialReportStatusFilter) => {
      updateParams((params) => {
        if (nextStatus === "ALL") params.delete("status");
        else params.set("status", nextStatus);
        params.delete("page");
      });
    },
    [updateParams]
  );

  const setScope = useCallback(
    (nextScope: AdminMaterialReportScope) => {
      updateParams((params) => {
        if (nextScope === "mine") params.set("scope", "mine");
        else params.delete("scope");
        params.delete("page");
      });
    },
    [updateParams]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      updateParams((params) => {
        if (nextPage <= 1) params.delete("page");
        else params.set("page", String(nextPage));
      });
    },
    [updateParams]
  );

  const selectMaterial = useCallback(
    (materialId: string | null) => {
      updateParams((params) => {
        if (materialId) params.set("selected", materialId);
        else params.delete("selected");
      });
    },
    [updateParams]
  );

  return {
    filters,
    selectedMaterialId,
    setStatus,
    setScope,
    setPage,
    selectMaterial,
    clearSelection: () => selectMaterial(null),
  };
}
