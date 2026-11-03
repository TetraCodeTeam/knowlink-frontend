import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountManagementCard from "@/modules/users/components/AccountManagementCard";

describe("AccountManagementCard", () => {
  it("sin onDeactivateAccount no muestra el botón Desactivar cuenta", () => {
    render(<AccountManagementCard onDeleteAccount={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Desactivar cuenta" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar cuenta" })).toBeInTheDocument();
  });

  it("sin onDeleteAccount no muestra el botón Eliminar cuenta", () => {
    render(<AccountManagementCard onDeactivateAccount={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Desactivar cuenta" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Eliminar cuenta" })).not.toBeInTheDocument();
  });

  it("con ambos handlers muestra las dos acciones", () => {
    render(<AccountManagementCard onDeactivateAccount={vi.fn()} onDeleteAccount={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Desactivar cuenta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar cuenta" })).toBeInTheDocument();
  });

  it("describe la desactivación como temporal y la eliminación como definitiva", () => {
    render(<AccountManagementCard onDeactivateAccount={vi.fn()} onDeleteAccount={vi.fn()} />);

    expect(
      screen.getByText("Podés desactivar tu cuenta temporalmente o eliminarla definitivamente.")
    ).toBeInTheDocument();
  });
});
