import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@mui/material";

const badgeSx = {
  "& .MuiBadge-badge": {
    fontSize: "10px",
    height: "16px",
    minWidth: "16px",
    padding: "0 3px",
  },
};

function renderBadge(count: number) {
  render(
    <Badge badgeContent={count} color="error" invisible={count === 0} max={99} sx={badgeSx}>
      <span data-testid="icon">bell</span>
    </Badge>
  );
}

describe("Badge de notificaciones", () => {
  it("oculta el badge cuando el conteo es 0", () => {
    renderBadge(0);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("muestra el conteo cuando hay notificaciones sin leer", () => {
    renderBadge(3);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("muestra 99+ cuando el conteo supera 99", () => {
    renderBadge(100);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });
});
