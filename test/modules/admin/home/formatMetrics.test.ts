import { describe, expect, it } from "vitest";
import {
  formatPercentValue,
  formatResolutionHours,
  formatSignedPercent,
} from "@/modules/admin/home/utils/format-metrics";

describe("formatResolutionHours", () => {
  it("muestra un decimal cuando hace falta", () => {
    expect(formatResolutionHours(3.8)).toBe("3.8h");
  });

  it("omite el decimal cuando es cero", () => {
    expect(formatResolutionHours(3)).toBe("3h");
  });

  it("usa un guion cuando no hay datos", () => {
    expect(formatResolutionHours(null)).toBe("—");
  });
});

describe("formatPercentValue", () => {
  it("conserva un decimal", () => {
    expect(formatPercentValue(8.2)).toBe("8.2%");
  });

  it("omite el decimal cuando es cero", () => {
    expect(formatPercentValue(8)).toBe("8%");
  });

  it("redondea a un decimal", () => {
    expect(formatPercentValue(66.666)).toBe("66.7%");
  });
});

describe("formatSignedPercent", () => {
  it("antepone el signo a los positivos", () => {
    expect(formatSignedPercent(12)).toBe("+12%");
  });

  it("mantiene el signo negativo", () => {
    expect(formatSignedPercent(-5)).toBe("-5%");
  });

  it("no agrega signo al cero", () => {
    expect(formatSignedPercent(0)).toBe("0%");
  });
});
