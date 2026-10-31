import { describe, expect, it } from "vitest";
import {
  buildOldestPendingCopy,
  buildPendingReportsCopy,
  type PillSegment,
} from "@/modules/admin/home/utils/queue-copy";

function toText(segments: PillSegment[]): string {
  return segments.map((segment) => segment.text).join("");
}

function emphasizedText(segments: PillSegment[]): string {
  return segments
    .filter((segment) => segment.emphasis)
    .map((segment) => segment.text)
    .join("");
}

describe("buildOldestPendingCopy", () => {
  it("muestra los días del reclamo más antiguo", () => {
    const segments = buildOldestPendingCopy(4);

    expect(toText(segments)).toBe("La más antigua espera hace 4 días");
    expect(emphasizedText(segments)).toBe("4 días");
  });

  it("usa singular con un día", () => {
    expect(toText(buildOldestPendingCopy(1))).toBe("La más antigua espera hace 1 día");
  });

  it("no muestra pendientes cuando el dato es null", () => {
    const segments = buildOldestPendingCopy(null);

    expect(toText(segments)).toBe("No hay reclamos pendientes");
    expect(emphasizedText(segments)).toBe("");
  });

  it("describe menos de un día cuando el valor es 0", () => {
    expect(toText(buildOldestPendingCopy(0))).toBe("La más antigua espera hace menos de un día");
  });
});

describe("buildPendingReportsCopy", () => {
  it("muestra un archivo con varios reportes", () => {
    const segments = buildPendingReportsCopy(1, 6);

    expect(toText(segments)).toBe("1 archivo con 6 reportes sin revisar");
    expect(emphasizedText(segments)).toBe("1 archivo ");
  });

  it("usa plurales correctos con varios archivos", () => {
    expect(toText(buildPendingReportsCopy(2, 2))).toBe("2 archivos con 2 reportes sin revisar");
  });

  it("usa singular de reporte", () => {
    expect(toText(buildPendingReportsCopy(1, 1))).toBe("1 archivo con 1 reporte sin revisar");
  });

  it("no muestra denuncias cuando no hay archivos pendientes", () => {
    const segments = buildPendingReportsCopy(0, 0);

    expect(toText(segments)).toBe("No hay denuncias sin revisar");
    expect(emphasizedText(segments)).toBe("");
  });
});
