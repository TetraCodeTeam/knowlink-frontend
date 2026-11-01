import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import ClaimResolutionForm from "@/modules/admin/session-claims/components/ClaimResolutionForm";
import { resolveSessionClaim } from "@/modules/admin/session-claims/api/admin-session-claims.api";

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

const mockedResolve = vi.mocked(resolveSessionClaim);
const mockedToast = vi.mocked(toast);

function backendError(message: string) {
  return { isAxiosError: true, response: { data: { message } } };
}

function renderForm() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <ClaimResolutionForm claimId="claim-1" />
    </QueryClientProvider>
  );
}

async function openConfirmation() {
  fireEvent.click(screen.getByRole("radio", { name: "Tutor" }));
  fireEvent.change(screen.getByLabelText(/Justificación/), {
    target: { value: "Se verificó la asistencia del alumno." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Confirmar resolución" }));

  return screen.findByRole("dialog");
}

describe("ClaimResolutionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no abre la confirmación si falta elegir una parte", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: /Confirmar resolución/ }));

    expect(await screen.findByText("Elegí a favor de quién resolver")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockedResolve).not.toHaveBeenCalled();
  });

  it("no abre la confirmación si la justificación está vacía", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("radio", { name: "Alumno" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmar resolución" }));

    expect(await screen.findByText("La justificación es obligatoria")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("confirma la resolución desde el diálogo", async () => {
    mockedResolve.mockResolvedValue(undefined);
    renderForm();

    const dialog = await openConfirmation();
    expect(
      within(dialog).getByText("¿Confirmar esta resolución?")
    ).toBeInTheDocument();
    expect(mockedResolve).not.toHaveBeenCalled();

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Confirmar resolución" })
    );

    await waitFor(() => {
      expect(mockedResolve).toHaveBeenCalledWith("claim-1", {
        favoredParty: "TUTOR",
        justification: "Se verificó la asistencia del alumno.",
      });
    });
  });

  it("cancelar la confirmación conserva la parte y la justificación", async () => {
    renderForm();

    const dialog = await openConfirmation();
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("radio", { name: "Tutor" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByLabelText(/Justificación/)).toHaveValue(
      "Se verificó la asistencia del alumno."
    );
  });

  it("ante un error muestra el message del backend, cierra el diálogo y conserva los valores", async () => {
    mockedResolve.mockRejectedValue(backendError("El reclamo ya fue resuelto."));
    renderForm();

    const dialog = await openConfirmation();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Confirmar resolución" })
    );

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("El reclamo ya fue resuelto.");
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("radio", { name: "Tutor" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByLabelText(/Justificación/)).toHaveValue(
      "Se verificó la asistencia del alumno."
    );
  });
});