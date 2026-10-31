import { describe, expect, it } from "vitest";
import { normalizeVolumeSplit } from "@/modules/admin/home/utils/volume-split";

describe("normalizeVolumeSplit", () => {
  it("deja intacta una distribución que ya suma 100", () => {
    expect(normalizeVolumeSplit({ claimsPct: 58, reportsPct: 42 })).toEqual({
      claimsPct: 58,
      reportsPct: 42,
    });
  });

  it("escala una distribución cuya suma no es 100", () => {
    const result = normalizeVolumeSplit({ claimsPct: 50, reportsPct: 25 });

    expect(result.claimsPct).toBeCloseTo(200 / 3, 6);
    expect(result.reportsPct).toBeCloseTo(100 / 3, 6);
    expect(result.claimsPct + result.reportsPct).toBeCloseTo(100, 10);
  });

  it("devuelve cero cuando no hay volumen", () => {
    expect(normalizeVolumeSplit({ claimsPct: 0, reportsPct: 0 })).toEqual({
      claimsPct: 0,
      reportsPct: 0,
    });
  });

  it("recorta valores negativos", () => {
    expect(normalizeVolumeSplit({ claimsPct: -10, reportsPct: 50 })).toEqual({
      claimsPct: 0,
      reportsPct: 100,
    });
  });

  it("reparte en partes iguales si ambos valores son iguales", () => {
    expect(normalizeVolumeSplit({ claimsPct: 200, reportsPct: 200 })).toEqual({
      claimsPct: 50,
      reportsPct: 50,
    });
  });
});
