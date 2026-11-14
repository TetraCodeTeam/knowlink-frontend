import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { ROLE_ACTIVATION_STATE } from "@/modules/app-shell/hooks/useRoleActivationRequest";
import TutorProfilePage from "@/modules/tutor/profile/components/TutorProfilePage";
import { getMyTutorProfile } from "@/modules/tutor/profile/api/getMyTutorProfile";
import type { TutorOwnProfileResponse } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

vi.mock("@/modules/tutor/profile/api/getMyTutorProfile", () => ({
  getMyTutorProfile: vi.fn(),
}));

vi.mock("@/modules/tutor/availability/hooks/useAvailableSubjects", () => ({
  useAvailableSubjects: () => ({ hasAvailableSubjects: false, isLoading: false }),
}));

const profile: TutorOwnProfileResponse = {
  userId: "tutor-1",
  fullName: "Carlos López",
  firstName: "Carlos",
  lastName: "López",
  email: "carlos@example.com",
  phoneNumber: "3534000000",
  careerId: "career-1",
  career: "Ingeniería en Sistemas de Información",
  institutionId: "institution-1",
  institution: "UTN FRVM",
  dni: "40123456",
  institutionalId: null,
  profilePictureUrl: null,
  address: null,
  mercadoPagoLinked: false,
  averageRating: null,
  biography: "Profesor de programación",
  subjects: [],
  hasStudentProfile: false,
};

const mockedGet = vi.mocked(getMyTutorProfile);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/tutor/profile"]}>
        <TutorProfilePage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

/** Hace lo mismo que el ítem "Activar rol de alumno" del menú del avatar. */
function RequestActivation() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/tutor/profile", { state: ROLE_ACTIVATION_STATE })}
    >
      pedir activación
    </button>
  );
}

describe("TutorProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue(profile);
  });

  it("muestra la sección de gestión de cuenta con las acciones de desactivar y eliminar", async () => {
    renderPage();

    expect(await screen.findByText("Gestión de Cuenta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desactivar cuenta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar cuenta" })).toBeInTheDocument();
  });

  it("Activar rol de alumno desde el menú vuelve a Información personal y abre la activación", async () => {
    // jsdom no implementa scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn();
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/tutor/profile"]}>
          <RequestActivation />
          <TutorProfilePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // La tarjeta del rol vive en "Información personal": en otra pestaña no se ve.
    await user.click(await screen.findByRole("tab", { name: /Materias/ }));
    expect(screen.getByRole("tab", { name: /Materias/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByText("Rol Alumno")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "pedir activación" }));

    expect(await screen.findByText("¿Activar tu perfil de alumno?")).toBeInTheDocument();
    // Con el diálogo abierto MUI oculta el resto de la página a las consultas por rol.
    expect(screen.getByRole("tab", { name: "Información personal", hidden: true })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
