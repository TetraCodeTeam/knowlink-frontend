import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgendaSummaryCards } from "@/modules/tutor/weekly-schedule/components/AgendaSummaryCards";

describe("AgendaSummaryCards — bloques libres", () => {
  it("muestra Bloque libre en singular con un solo bloque", () => {
    render(<AgendaSummaryCards confirmedBookings={0} freeBlocks={1} nextSession={null} />);

    expect(screen.getByText("Bloque libre")).toBeInTheDocument();
    expect(screen.getByText("de 1 hora")).toBeInTheDocument();
  });

  it("muestra Bloques libres en plural con cero bloques", () => {
    render(<AgendaSummaryCards confirmedBookings={0} freeBlocks={0} nextSession={null} />);

    expect(screen.getByText("Bloques libres")).toBeInTheDocument();
    expect(screen.getByText("de 1 hora")).toBeInTheDocument();
  });

  it("muestra Bloques libres en plural con mas de un bloque", () => {
    render(<AgendaSummaryCards confirmedBookings={2} freeBlocks={3} nextSession={null} />);

    expect(screen.getByText("Bloques libres")).toBeInTheDocument();
    expect(screen.getByText("de 1 hora")).toBeInTheDocument();
  });
});
