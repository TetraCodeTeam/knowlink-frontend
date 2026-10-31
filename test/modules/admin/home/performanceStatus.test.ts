import { describe, expect, it } from "vitest";
import { getUnresolvedStatus } from "@/modules/admin/home/constants/performance-status.constants";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

describe("getUnresolvedStatus", () => {
  it("traduce UNDER_CONTROL a bajo control", () => {
    expect(getUnresolvedStatus("UNDER_CONTROL")).toEqual({
      level: "UNDER_CONTROL",
      label: "Bajo control",
      color: ADMIN_TOKENS.emerald600,
    });
  });

  it("traduce ACCEPTABLE a aceptable", () => {
    expect(getUnresolvedStatus("ACCEPTABLE")).toEqual({
      level: "ACCEPTABLE",
      label: "Aceptable",
      color: ADMIN_TOKENS.amber700,
    });
  });

  it("traduce RISKY a riesgoso", () => {
    expect(getUnresolvedStatus("RISKY")).toEqual({
      level: "RISKY",
      label: "Riesgoso",
      color: ADMIN_TOKENS.rose500,
    });
  });

  it("traduce CRITICAL a crítico", () => {
    expect(getUnresolvedStatus("CRITICAL")).toEqual({
      level: "CRITICAL",
      label: "Crítico",
      color: ADMIN_TOKENS.rose700,
    });
  });
});
