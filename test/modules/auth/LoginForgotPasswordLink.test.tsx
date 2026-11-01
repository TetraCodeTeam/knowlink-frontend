import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "@/modules/auth/components/LoginForm";
import { EXCLUDED_BEARER_ROUTES } from "@/shared/lib/constants";

describe("Login - Olvidé mi contraseña", () => {
  it("CP-034.F18 - el login muestra el enlace hacia /auth/forgot-password sin estar autenticado (CA 1)", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/auth/login"]}>
          <LoginForm />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole("link", { name: "Olvidé mi contraseña" })).toHaveAttribute(
      "href",
      "/auth/forgot-password"
    );
  });

  it("CP-034.F19 - los endpoints de recuperación no llevan Bearer (token viejo en el store no los cancela)", () => {
    expect(EXCLUDED_BEARER_ROUTES).toEqual(
      expect.arrayContaining(["/api/v1/users/reset-password/email", "/api/v1/users/reset-password"])
    );
  });
});
