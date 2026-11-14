import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeactivateAccountDialog from "@/modules/users/components/DeactivateAccountDialog";

describe("DeactivateAccountDialog", () => {
  it("muestra la explicación de qué implica desactivar la cuenta", () => {
    render(
      <DeactivateAccountDialog open isPending={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    expect(
      screen.getByText(/Tu cuenta dejará de ser visible para el resto de los usuarios/)
    ).toBeInTheDocument();
    expect(screen.getByText(/vamos a cerrar tu sesión/)).toBeInTheDocument();
  });

  it("explica cómo reactivar la cuenta: volviendo a iniciar sesión", () => {
    render(
      <DeactivateAccountDialog open isPending={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    expect(
      screen.getByText(/Para reactivarla, volvé a iniciar sesión con tu correo y tu contraseña/)
    ).toBeInTheDocument();
    // No debe prometer lo contrario: la cuenta sí se puede reactivar al intentar entrar.
    expect(screen.queryByText(/no podrás iniciar sesión/)).not.toBeInTheDocument();
  });

  it("Cancelar cierra el diálogo sin confirmar", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeactivateAccountDialog open isPending={false} onConfirm={onConfirm} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Desactivar cuenta ejecuta la confirmación", () => {
    const onConfirm = vi.fn();

    render(
      <DeactivateAccountDialog open isPending={false} onConfirm={onConfirm} onCancel={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Desactivar cuenta" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("con isPending deshabilita ambos botones", () => {
    render(<DeactivateAccountDialog open isPending onConfirm={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Desactivar cuenta" })).toBeDisabled();
  });
});
