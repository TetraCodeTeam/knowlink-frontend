import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

export function makeMaterial(overrides: Partial<Material> = {}): Material {
  return {
    id: "mat-1",
    name: "Resumen Unidad 3 - Derivadas",
    originalFileName: "resumen_derivadas.pdf",
    tutorId: "tutor-1",
    tutorName: "Ana Gómez",
    subjectId: "subject-1",
    subjectName: "Análisis Matemático",
    format: "PDF",
    downloadUrl: "https://example.com/firmada",
    uploadedAt: "2026-10-01T10:00:00",
    sizeInBytes: 1024,
    ...overrides,
  };
}
