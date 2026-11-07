import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import TutorRoleCard from "@/modules/student/dual-role/components/TutorRoleCard";

vi.mock("@/modules/student/dual-role/hooks/useSwitchToTutorRole", () => ({
  useSwitchToTutorRole: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock("@/modules/auth/hooks/useAuthStore", () => ({
  useAuthStore: () => ({ authResponse: null, login: vi.fn() }),
}));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-state">{JSON.stringify(location.state)}</div>;
}

function renderCard() {
  const queryClient = new QueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/profile"]}>
        <Routes>
          <Route
            path="/student/profile"
            element={
              <TutorRoleCard
                hasTutorProfile={false}
                career="Medicina Veterinaria"
                institutionId="institution-unvm"
              />
            }
          />
          <Route path="/auth/register/tutor" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("TutorRoleCard", () => {
  it("navega al alta de tutor con la carrera y la institución del alumno", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: /Activar Rol Tutor/i }));
    await user.click(await screen.findByRole("button", { name: "Continuar" }));

    const state = await screen.findByTestId("location-state");
    expect(state).toHaveTextContent("institution-unvm");
    expect(state).toHaveTextContent("Medicina Veterinaria");
  });
});
