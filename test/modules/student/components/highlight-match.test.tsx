import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { highlightMatch } from "@/modules/student/components/highlight-match";

describe("US-46 / CP-003 — Búsqueda unificada (highlight)", () => {
  it("CP-003.01 — Envuelve la primera coincidencia (case-insensitive) en <strong>", () => {
    const { container } = render(<>{highlightMatch("Ana García", "ana")}</>);
    expect(container.querySelector("strong")).toHaveTextContent("Ana");
  });

  it("CP-003.02 — Devuelve texto plano si no hay coincidencia", () => {
    const { container } = render(<>{highlightMatch("Ana García", "zzz")}</>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container).toHaveTextContent("Ana García");
  });

  it("CP-003.03 — Devuelve texto plano si la query está vacía o en blanco", () => {
    const { container } = render(<>{highlightMatch("Ana García", "")}</>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container).toHaveTextContent("Ana García");
  });

  it("CP-003.04 — Solo envuelve la primera ocurrencia cuando se repite", () => {
    const { container } = render(<>{highlightMatch("Ana Ana", "ana")}</>);
    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(1);
    expect(strongs[0]).toHaveTextContent("Ana");
  });
});
