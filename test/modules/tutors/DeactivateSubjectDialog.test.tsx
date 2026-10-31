import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DeactivateSubjectDialog from "@/modules/tutors/components/DeactivateSubjectDialog";

const MESSAGE =
  'La materia "Física 1" dejará de aparecer en el buscador y no podrá recibir nuevas reservas. ' +
  "Podés reactivarla cuando quieras desde la sección Materias de tu perfil.";

function renderDialog(isPending = false) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  render(
    <DeactivateSubjectDialog
      open
      subjectName="Física 1"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );

  return { onConfirm, onCancel };
}

describe("DeactivateSubjectDialog", () => {
  it("muestra el texto de confirmación con el nombre de la materia", () => {
    renderDialog();

    expect(screen.getByText("Desactivar materia")).toBeInTheDocument();
    expect(screen.getByText(MESSAGE)).toBeInTheDocument();
  });

  it("cancelar llama a onCancel y no a onConfirm", () => {
    const { onConfirm, onCancel } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirmar llama a onConfirm", () => {
    const { onConfirm, onCancel } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("deshabilita el botón Desactivar mientras la request está en curso", () => {
    renderDialog(true);

    expect(screen.getByRole("button", { name: "Desactivar" })).toBeDisabled();
  });
});
