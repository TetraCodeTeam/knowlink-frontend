import { describe, expect, it } from "vitest";
import { buildResolutionDeltaCopy } from "@/modules/admin/home/utils/performance-delta";

describe("buildResolutionDeltaCopy", () => {
  it("describe un delta positivo como más rápido", () => {
    expect(buildResolutionDeltaCopy(18)).toEqual({
      text: "+18% más rápido",
      tone: "positive",
    });
  });

  it("describe un delta negativo como más lento y sin signo en el texto", () => {
    expect(buildResolutionDeltaCopy(-10)).toEqual({
      text: "10% más lento",
      tone: "negative",
    });
  });

  it("no muestra delta sin base de comparación", () => {
    expect(buildResolutionDeltaCopy(null)).toBeNull();
  });

  it("describe el empate como sin cambios", () => {
    expect(buildResolutionDeltaCopy(0)).toEqual({
      text: "Sin cambios",
      tone: "neutral",
    });
  });
});
