import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import EditProfileForm from "@/modules/users/components/EditProfileForm";
import type { EditProfileFormValues } from "@/modules/users/schemas/editProfile.schema";

vi.mock("@/modules/tutors/hooks/useCareers", () => ({
  useCareers: () => ({
    data: [
      { careerId: "career-1", name: "Ingeniería en Sistemas de Información" },
      { careerId: "career-2", name: "Licenciatura en Administración" },
    ],
    isLoading: false,
  }),
}));

const baseValues: EditProfileFormValues = {
  firstName: "Ana",
  lastName: "García",
  dni: "40123456",
  phoneNumber: "3534123456",
  career: "Ingeniería en Sistemas de Información",
  institutionalId: "",
  biography: "",
  address: "",
};

function renderForm(overrides: Partial<ComponentProps<typeof EditProfileForm>> = {}) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  render(
    <EditProfileForm
      variant="student"
      email="ana@example.com"
      defaultValues={baseValues}
      isPending={false}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...overrides}
    />
  );

  return { onSubmit, onCancel };
}

function getSaveButton() {
  return screen.getByRole("button", { name: "Guardar cambios" });
}

describe("EditProfileForm", () => {
  it("muestra los valores precargados", async () => {
    renderForm();

    expect(screen.getByPlaceholderText("Nombre")).toHaveValue("Ana");
    expect(screen.getByPlaceholderText("Apellido")).toHaveValue("García");
    expect(screen.getByPlaceholderText("Teléfono celular")).toHaveValue("3534123456");
    expect(screen.getByPlaceholderText("DNI")).toHaveValue("40123456");
    expect(screen.getByRole("combobox")).toHaveTextContent("Ingeniería en Sistemas de Información");
    await waitFor(() => expect(getSaveButton()).toBeDisabled());
  });

  it("muestra el correo deshabilitado con la leyenda siempre visible", async () => {
    renderForm();

    const emailInput = screen.getByTestId("email-field");

    expect(emailInput).toBeDisabled();
    expect(emailInput).toHaveValue("ana@example.com");
    expect(screen.getByText("El correo electrónico no puede modificarse.")).toBeInTheDocument();
    await waitFor(() => expect(getSaveButton()).toBeDisabled());
  });

  it("mantiene Guardar cambios deshabilitado sin cambios y lo habilita al editar", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(getSaveButton()).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Teléfono celular"), "9");

    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it("resalta el nombre vacío y deshabilita Guardar hasta completarlo", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByPlaceholderText("Nombre");

    await user.clear(nameInput);

    expect(await screen.findByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(getSaveButton()).toBeDisabled();

    await user.type(nameInput, "Anabella");

    await waitFor(() => {
      expect(screen.queryByText("El nombre es obligatorio")).not.toBeInTheDocument();
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it("no muestra Biografía ni Dirección para el alumno", async () => {
    renderForm({ variant: "student" });

    expect(screen.queryByPlaceholderText("Biografía")).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Dirección para clases presenciales")
    ).not.toBeInTheDocument();
    await waitFor(() => expect(getSaveButton()).toBeDisabled());
  });

  it("muestra Biografía y Dirección para el tutor", async () => {
    renderForm({ variant: "tutor" });

    expect(screen.getByPlaceholderText("Biografía")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Dirección para clases presenciales")).toBeInTheDocument();
    await waitFor(() => expect(getSaveButton()).toBeDisabled());
  });

  it("exige la dirección al tutor con clases presenciales", async () => {
    renderForm({ variant: "tutor", requiresAddress: true });

    expect(
      await screen.findByText("La dirección es obligatoria para clases presenciales")
    ).toBeInTheDocument();
    expect(getSaveButton()).toBeDisabled();
  });

  it("envía los valores sin la clave email", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByPlaceholderText("Apellido"), " López");
    await user.click(getSaveButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    const [values] = onSubmit.mock.calls[0] as [EditProfileFormValues, unknown];
    expect(values).not.toHaveProperty("email");
    expect(values.lastName).toBe("García López");
  });

  it("llama a onCancel al presionar Cancelar", async () => {
    const user = userEvent.setup();
    const { onCancel } = renderForm();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
