import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContactInfoDialog from "@/modules/admin/session-claims/components/ContactInfoDialog";
import { getSessionClaimContactInfo } from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { makeContactInfo } from "./fixtures";

vi.mock("@/modules/admin/session-claims/api/admin-session-claims.api", () => ({
  getSessionClaims: vi.fn(),
  getSessionClaimDetail: vi.fn(),
  assignSessionClaim: vi.fn(),
  getSessionClaimContactInfo: vi.fn(),
  resolveSessionClaim: vi.fn(),
}));

const mockedContact = vi.mocked(getSessionClaimContactInfo);

function ui(open: boolean, onClose = vi.fn(), claimId = "claim-1") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    client,
    onClose,
    view: (
      <QueryClientProvider client={client}>
        <ContactInfoDialog claimId={claimId} open={open} onClose={onClose} />
      </QueryClientProvider>
    ),
  };
}

function renderDialog(open: boolean) {
  const { client, onClose, view } = ui(open);
  const result = render(view);

  return { ...result, client, onClose };
}

describe("ContactInfoDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedContact.mockResolvedValue(makeContactInfo());
  });

  it("no consulta los datos hasta que el diálogo se abre", () => {
    renderDialog(false);

    expect(mockedContact).not.toHaveBeenCalled();
  });

  it("muestra los datos de contacto de ambas partes al abrirse", async () => {
    renderDialog(true);

    expect(await screen.findByText("+54 11 5555-1001")).toBeInTheDocument();
    expect(screen.getByText("Datos de contacto")).toBeInTheDocument();
    expect(screen.getByText("Uso confidencial para mediación")).toBeInTheDocument();
    expect(screen.getByText("Silvina Rubio")).toBeInTheDocument();
    expect(screen.getByText("Bruno Peralta")).toBeInTheDocument();
    expect(screen.getByText("LEG-2001")).toBeInTheDocument();
    expect(screen.getByText("38.101.401")).toBeInTheDocument();
    expect(mockedContact).toHaveBeenCalledTimes(1);
  });

  it("se cierra con Cerrar", async () => {
    const { onClose } = renderDialog(true);

    fireEvent.click(await screen.findByRole("button", { name: "Cerrar" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("al reabrir vuelve a consultar los datos", async () => {
    const { rerender } = renderDialog(false);

    rerender(ui(true, vi.fn()).view);
    await screen.findByText("+54 11 5555-1001");
    expect(mockedContact).toHaveBeenCalledTimes(1);

    rerender(ui(false, vi.fn()).view);
    await waitFor(() => {
      expect(screen.queryByText("+54 11 5555-1001")).not.toBeInTheDocument();
    });

    rerender(ui(true, vi.fn()).view);
    await screen.findByText("+54 11 5555-1001");
    await waitFor(() => expect(mockedContact).toHaveBeenCalledTimes(2));
  });

  it("muestra el error y permite reintentar", async () => {
    mockedContact.mockRejectedValueOnce(new Error("network"));
    renderDialog(true);

    expect(
      await screen.findByText("No pudimos cargar los datos de contacto")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("+54 11 5555-1001")).toBeInTheDocument();
    expect(mockedContact).toHaveBeenCalledTimes(2);
  });
});