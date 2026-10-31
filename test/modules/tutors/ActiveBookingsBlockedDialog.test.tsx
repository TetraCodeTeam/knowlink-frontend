import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import ActiveBookingsBlockedDialog from "@/modules/tutors/components/ActiveBookingsBlockedDialog";
import { MY_BOOKINGS_ROUTE } from "@/modules/tutors/constants";

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe("ActiveBookingsBlockedDialog", () => {
  it("muestra el mensaje de bloqueo por reservas activas", () => {
    render(
      <MemoryRouter initialEntries={["/tutor/profile"]}>
        <ActiveBookingsBlockedDialog open onClose={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "No podés desactivar esta materia porque tiene reservas activas. Cancelalas o esperá a que se completen para poder desactivarla."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  });

  it("Ir a Mis reservas navega a la ruta y cierra el diálogo", () => {
    const onClose = vi.fn();

    render(
      <MemoryRouter initialEntries={["/tutor/profile"]}>
        <ActiveBookingsBlockedDialog open onClose={onClose} />
        <LocationDisplay />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ir a Mis reservas" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("location")).toHaveTextContent(MY_BOOKINGS_ROUTE);
  });
});
