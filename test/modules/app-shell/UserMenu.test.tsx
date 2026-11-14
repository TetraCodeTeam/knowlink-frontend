import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import UserMenu from "@/modules/app-shell/components/UserMenu";
import { useCurrentUser } from "@/modules/app-shell/hooks/useCurrentUser";
import type { NavTheme } from "@/modules/app-shell/interfaces/navigation.interface";

vi.mock("@/modules/app-shell/hooks/useCurrentUser", () => ({ useCurrentUser: vi.fn() }));

vi.mock("@/modules/app-shell/hooks/useRoleSwitch", () => ({
  useRoleSwitch: () => ({
    target: {
      role: "TUTOR",
      label: "Tutor",
      homePath: "/tutor/home",
      activationPath: "/student/profile",
    },
    switchRole: vi.fn(),
    isSwitching: false,
    isRedirectDialogOpen: false,
    completeSwitch: vi.fn(),
  }),
}));

vi.mock("@/modules/auth/logout/hooks/useLogout", () => ({
  useLogout: () => ({ triggerLogout: vi.fn(), isPending: false }),
}));

const theme = {
  actionColor: "#111",
  actionHoverBg: "#eee",
  avatarBg: "#ccc",
  avatarText: "#000",
} as unknown as NavTheme;

const mockedUser = vi.mocked(useCurrentUser);

function Destination() {
  const location = useLocation();
  return (
    <div>
      <span data-testid="path">{location.pathname}</span>
      <span data-testid="state">{JSON.stringify(location.state)}</span>
    </div>
  );
}

function renderMenu() {
  render(
    <MemoryRouter initialEntries={["/student/home"]}>
      <Routes>
        <Route
          path="/student/home"
          element={
            <>
              <UserMenu theme={theme} profilePath="/student/profile" />
              <Destination />
            </>
          }
        />
        <Route path="/student/profile" element={<Destination />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("UserMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sin el otro rol ofrece activarlo y avisa al perfil que abra la activación", async () => {
    mockedUser.mockReturnValue({
      role: "STUDENT",
      displayName: "Ana García",
      email: "ana@example.com",
      pictureUrl: null,
      hasOtherRole: false,
    });
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Menú de usuario" }));
    await user.click(await screen.findByRole("menuitem", { name: /Activar rol de tutor/i }));

    // Navegar al perfil no alcanza si ya se está ahí: el pedido viaja en el estado de la ubicación.
    expect(screen.getByTestId("path")).toHaveTextContent("/student/profile");
    expect(screen.getByTestId("state")).toHaveTextContent('{"activateRole":true}');
  });

  it("con el otro rol ya activo ofrece cambiar de modo y no activarlo", async () => {
    mockedUser.mockReturnValue({
      role: "STUDENT",
      displayName: "Ana García",
      email: "ana@example.com",
      pictureUrl: null,
      hasOtherRole: true,
    });
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Menú de usuario" }));

    expect(
      await screen.findByRole("menuitem", { name: /Cambiar a modo Tutor/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /Activar rol/i })).not.toBeInTheDocument();
  });
});
