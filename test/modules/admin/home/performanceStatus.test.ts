import { describe, expect, it } from "vitest";
import {
  UNRESOLVED_STATUS_THRESHOLDS,
  getUnresolvedStatus,
} from "@/modules/admin/home/constants/performance-status.constants";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

describe("getUnresolvedStatus", () => {
  it("marca bajo control por debajo del primer umbral", () => {
    const status = getUnresolvedStatus(UNRESOLVED_STATUS_THRESHOLDS.warning - 0.1);

    expect(status).toEqual({
      level: "ok",
      label: "Bajo control",
      color: ADMIN_TOKENS.emerald600,
    });
  });

  it("marca atención justo en el primer umbral", () => {
    const status = getUnresolvedStatus(UNRESOLVED_STATUS_THRESHOLDS.warning);

    expect(status.level).toBe("warning");
    expect(status.label).toBe("Atención");
    expect(status.color).toBe(ADMIN_TOKENS.amber700);
  });

  it("mantiene atención por debajo del segundo umbral", () => {
    expect(getUnresolvedStatus(UNRESOLVED_STATUS_THRESHOLDS.critical - 0.1).level).toBe("warning");
  });

  it("marca crítico desde el segundo umbral", () => {
    const status = getUnresolvedStatus(UNRESOLVED_STATUS_THRESHOLDS.critical);

    expect(status).toEqual({
      level: "critical",
      label: "Crítico",
      color: ADMIN_TOKENS.rose700,
    });
  });

  it("trata los extremos del rango como bajo control y crítico", () => {
    expect(getUnresolvedStatus(0).level).toBe("ok");
    expect(getUnresolvedStatus(100).level).toBe("critical");
  });
});
