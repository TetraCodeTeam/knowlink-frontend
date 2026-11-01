import { describe, expect, it } from "vitest";
import { formatHeldAmount } from "@/modules/admin/session-claims/utils/format-held-amount";
import { formatSessionDate } from "@/modules/admin/session-claims/utils/format-session-date";

describe("formatSessionDate", () => {
  it("formatea una fecha ISO sin corrimiento de zona horaria", () => {
    expect(formatSessionDate("2026-07-22")).toBe("22 de julio");
    expect(formatSessionDate("2026-01-01")).toBe("1 de enero");
    expect(formatSessionDate("2026-12-31")).toBe("31 de diciembre");
  });

  it("devuelve el valor original si no es una fecha ISO", () => {
    expect(formatSessionDate("22/07/2026")).toBe("22/07/2026");
  });
});

describe("formatHeldAmount", () => {
  it("formatea el monto retenido en pesos argentinos", () => {
    expect(formatHeldAmount(8000)).toMatch(/\$\s?8\.000/);
  });
});