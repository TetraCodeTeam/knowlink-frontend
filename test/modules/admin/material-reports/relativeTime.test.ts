import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "@/modules/admin/material-reports/utils/relative-time";

const NOW = new Date(2026, 9, 28, 18, 20);

describe("formatRelativeTime", () => {
  it("muestra horas cuando fue hoy", () => {
    expect(formatRelativeTime(new Date(2026, 9, 28, 16, 20).toISOString(), NOW)).toBe(
      "Hace 2 horas"
    );
  });

  it("muestra ayer con la hora", () => {
    expect(formatRelativeTime(new Date(2026, 9, 27, 18, 20).toISOString(), NOW)).toBe(
      "Ayer a las 18:20"
    );
  });

  it("muestra días cuando pasó más de un día", () => {
    expect(formatRelativeTime(new Date(2026, 9, 26, 10, 0).toISOString(), NOW)).toBe("Hace 2 días");
  });

  it("muestra minutos y el instante inicial", () => {
    expect(formatRelativeTime(new Date(2026, 9, 28, 18, 5).toISOString(), NOW)).toBe(
      "Hace 15 minutos"
    );
    expect(formatRelativeTime(new Date(2026, 9, 28, 18, 19, 45).toISOString(), NOW)).toBe(
      "Hace un momento"
    );
  });

  it("cae a fecha corta para denuncias viejas", () => {
    expect(formatRelativeTime("2026-09-12T10:00:00", NOW)).toBe("12 sept");
  });

  it("devuelve vacío con una fecha inválida", () => {
    expect(formatRelativeTime("no-es-fecha", NOW)).toBe("");
  });
});
