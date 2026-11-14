import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import StudentRoleCard from "@/modules/tutor/dual-role/components/StudentRoleCard";

vi.mock("@/modules/tutor/dual-role/hooks/useActivateStudentRole", () => ({
  useActivateStudentRole: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock("@/modules/tutor/dual-role/hooks/useSwitchToStudentRole", () => ({
  useSwitchToStudentRole: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock("@/modules/auth/hooks/useAuthStore", () => ({
  useAuthStore: () => ({ authResponse: null, login: vi.fn(), logout: vi.fn() }),
}));

const DIALOG_TITLE = "¿Activar tu perfil de alumno?";

function card(props: { hasStudentProfile: boolean; activationRequest?: number }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <StudentRoleCard {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("StudentRoleCard", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom no implementa scrollIntoView.
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  it("no abre el diálogo por sí sola", () => {
    render(card({ hasStudentProfile: false, activationRequest: 0 }));

    expect(screen.queryByText(DIALOG_TITLE)).not.toBeInTheDocument();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("cuando el menú del avatar pide activar el rol, se centra en pantalla y abre el diálogo", async () => {
    const { rerender } = render(card({ hasStudentProfile: false, activationRequest: 0 }));

    rerender(card({ hasStudentProfile: false, activationRequest: 1 }));

    expect(await screen.findByText(DIALOG_TITLE)).toBeInTheDocument();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
  });

  it("si el rol ya está activo ignora el pedido: no hay nada que activar", () => {
    render(card({ hasStudentProfile: true, activationRequest: 1 }));

    expect(screen.queryByText(DIALOG_TITLE)).not.toBeInTheDocument();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
