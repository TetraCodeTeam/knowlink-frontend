import { describe, expect, it } from "vitest";
import { formatAdminDate } from "@/modules/admin/home/utils/format-admin-date";

describe("formatAdminDate", () => {
  it("formatea la fecha del diseño en español", () => {
    expect(formatAdminDate(new Date(2026, 5, 15))).toBe("Lunes 15 de junio, 2026");
  });

  it("capitaliza solo la primera letra", () => {
    expect(formatAdminDate(new Date(2026, 0, 5))).toBe("Lunes 5 de enero, 2026");
  });

  it("respeta el día de la semana real", () => {
    expect(formatAdminDate(new Date(2026, 11, 25))).toBe("Viernes 25 de diciembre, 2026");
  });

  it("no duplica la coma antes del año", () => {
    const result = formatAdminDate(new Date(2026, 9, 28));

    expect(result).toBe("Miércoles 28 de octubre, 2026");
    expect(result).not.toContain(",,");
  });
});
