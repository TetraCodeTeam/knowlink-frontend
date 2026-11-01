import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignSessionClaim,
  getSessionClaims,
  resolveSessionClaim,
} from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { useAdminSessionClaims } from "@/modules/admin/session-claims/hooks/useAdminSessionClaims";
import { useAssignSessionClaim } from "@/modules/admin/session-claims/hooks/useAssignSessionClaim";
import { useResolveSessionClaim } from "@/modules/admin/session-claims/hooks/useResolveSessionClaim";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";
import { makeSessionClaimListResponse } from "./fixtures";

vi.mock("@/modules/admin/session-claims/api/admin-session-claims.api", () => ({
  getSessionClaims: vi.fn(),
  getSessionClaimDetail: vi.fn(),
  assignSessionClaim: vi.fn(),
  getSessionClaimContactInfo: vi.fn(),
  resolveSessionClaim: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedList = vi.mocked(getSessionClaims);
const mockedAssign = vi.mocked(assignSessionClaim);
const mockedResolve = vi.mocked(resolveSessionClaim);
const mockedToast = vi.mocked(toast);

function backendError(message: string) {
  return { isAxiosError: true, response: { data: { message } } };
}

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { invalidateSpy, wrapper };
}

function expectSessionClaimInvalidations(
  invalidateSpy: ReturnType<typeof setup>["invalidateSpy"],
  claimId: string
) {
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: adminQueryKeys.sessionClaimsBase });
  expect(invalidateSpy).toHaveBeenCalledWith({
    queryKey: adminQueryKeys.sessionClaims.detail(claimId),
  });
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: adminQueryKeys.navigationBadges });
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: adminQueryKeys.dashboardBase });
}

describe("hooks de reclamos de sesión", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lista con la página de 4 y conserva los filtros", async () => {
    mockedList.mockResolvedValue(makeSessionClaimListResponse());
    const { wrapper } = setup();
    const { result } = renderHook(
      () => useAdminSessionClaims({ status: "OPEN", scope: "all", page: 2 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));

    expect(mockedList).toHaveBeenCalledWith({
      status: "OPEN",
      scope: "all",
      page: 2,
      size: 4,
    });
    expect(result.current.totalElements).toBe(1);
    expect(result.current.statusCounts).toEqual({ open: 5, inReview: 4, resolved: 5 });
  });

  it("toma la solicitud e invalida lista, detalle y dashboard", async () => {
    mockedAssign.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useAssignSessionClaim("claim-1"), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAssign).toHaveBeenCalledWith("claim-1");
    expect(mockedToast.success).toHaveBeenCalled();
    expectSessionClaimInvalidations(invalidateSpy, "claim-1");
  });

  it("ante un 409 muestra el message del backend y refresca el estado real", async () => {
    mockedAssign.mockRejectedValue(
      backendError("La solicitud ya fue tomada por otro administrador.")
    );
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useAssignSessionClaim("claim-1"), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedToast.error).toHaveBeenCalledWith(
      "La solicitud ya fue tomada por otro administrador."
    );
    await waitFor(() => expectSessionClaimInvalidations(invalidateSpy, "claim-1"));
  });

  it("resuelve con la parte elegida y la justificación, e invalida las claves", async () => {
    mockedResolve.mockResolvedValue(undefined);
    const { invalidateSpy, wrapper } = setup();
    const { result } = renderHook(() => useResolveSessionClaim("claim-1"), { wrapper });

    act(() => {
      result.current.mutate({
        favoredParty: "STUDENT",
        justification: "El tutor no se presentó.",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedResolve).toHaveBeenCalledWith("claim-1", {
      favoredParty: "STUDENT",
      justification: "El tutor no se presentó.",
    });
    expect(mockedToast.success).toHaveBeenCalled();
    expectSessionClaimInvalidations(invalidateSpy, "claim-1");
  });

  it("muestra el message del backend si la resolución falla", async () => {
    mockedResolve.mockRejectedValue(backendError("El reclamo ya fue resuelto."));
    const { wrapper } = setup();
    const { result } = renderHook(() => useResolveSessionClaim("claim-1"), { wrapper });

    act(() => {
      result.current.mutate({ favoredParty: "TUTOR", justification: "Se verificó." });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedToast.error).toHaveBeenCalledWith("El reclamo ya fue resuelto.");
  });
});
