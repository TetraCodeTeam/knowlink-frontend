import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
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
  career: "Ingeniería en Sistemas de Información",
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
});
