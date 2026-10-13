import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";
import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";

// Datos de prueba para maquetar. Eliminar al conectar con el backend.
// Para ver los estados vacíos, dejar los arrays en [].

export const MOCK_CLAIMS: ClaimResponse[] = [
  {
    id: 1,
    subjectName: "Análisis Matemático 2",
    studentName: "Bruno Peralta",
    sessionDate: "2026-07-15",
    reason: "El alumno no se presentó a la sesión",
    status: "OPEN",
    resolvedAt: null,
    hasUnseenUpdate: true,
  },
  {
    id: 2,
    subjectName: "Física 1",
    studentName: "Camila Rojas",
    sessionDate: "2026-06-28",
    reason: "Disputa por la duración de la sesión",
    status: "IN_REVIEW",
    resolvedAt: null,
    hasUnseenUpdate: false,
  },
  {
    id: 3,
    subjectName: "Diseño de Sistemas",
    studentName: "Julián Medina",
    sessionDate: "2026-06-20",
    reason: "Cobro duplicado de la sesión",
    status: "RESOLVED",
    resolvedAt: "2026-06-28",
    hasUnseenUpdate: false,
  },
];

export const MOCK_MATERIALS: ReportedMaterialResponse[] = [
  {
    id: 1,
    fileName: "Guía de integrales.pdf",
    fileFormat: "PDF",
    subjectName: "Análisis Matemático 2",
    reportCount: 2,
    status: "PENDING",
    hasUnseenUpdate: true,
  },
  {
    id: 2,
    fileName: "Resumen_final.png",
    fileFormat: "PNG",
    subjectName: "Física 1",
    reportCount: 1,
    status: "IN_REVIEW",
    hasUnseenUpdate: false,
  },
  {
    id: 3,
    fileName: "Ejercicios_práctica_graficos.xlsx",
    fileFormat: "XLSX",
    subjectName: "Diseño de sistemas",
    reportCount: 1,
    status: "RESOLVED",
    hasUnseenUpdate: false,
  },
];
