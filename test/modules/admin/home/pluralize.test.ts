import { describe, expect, it } from "vitest";
import { pluralize } from "@/modules/admin/home/utils/pluralize";

describe("pluralize", () => {
  it("usa singular para 1", () => {
    expect(pluralize(1, "día", "días")).toBe("día");
  });

  it("usa plural para 0", () => {
    expect(pluralize(0, "archivo", "archivos")).toBe("archivos");
  });

  it("usa plural para más de 1", () => {
    expect(pluralize(6, "reporte", "reportes")).toBe("reportes");
  });
});
