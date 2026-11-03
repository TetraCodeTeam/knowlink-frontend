import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeactivateAccountDialog from "@/modules/users/components/DeactivateAccountDialog";

const CONFIRMATION_TEXT =
  "Tu cuenta dejará de ser visible para el resto de los usuarios y no podrás iniciar sesión hasta reactivarla. Tu información se conserva para cuando quieras volver.";

describe("DeactivateAccountDialog", () => {
  it("muestra la explicación de qué implica desactivar la cuenta", () => {
    render(
      <DeactivateAccountDialog open isPending={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    expect(screen.getByText(CONFIRMATION_TEXT)).toBeInTheDocument();
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
