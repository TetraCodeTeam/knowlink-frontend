import { describe, expect, it } from "vitest";
import {
  getDownloadFileName,
  getDownloadMime,
  getPreviewKind,
  PREVIEW_MIME,
} from "@/shared/material-preview/utils/previewFormat";

describe("getPreviewKind", () => {
  it("reconoce PDF en cualquier capitalizacion", () => {
    expect(getPreviewKind("PDF")).toBe("pdf");
    expect(getPreviewKind("pdf")).toBe("pdf");
  });

  it("reconoce PNG", () => {
    expect(getPreviewKind("PNG")).toBe("image");
  });

  it("todo lo demas no tiene vista previa", () => {
    expect(getPreviewKind("XLSX")).toBe("unsupported");
    expect(getPreviewKind("DOCX")).toBe("unsupported");
    expect(getPreviewKind("")).toBe("unsupported");
  });
});

describe("PREVIEW_MIME", () => {
  it("fija el MIME de cada formato soportado", () => {
    expect(PREVIEW_MIME.pdf).toBe("application/pdf");
    expect(PREVIEW_MIME.image).toBe("image/png");
  });
});

describe("getDownloadMime", () => {
  it("fija el MIME de descarga segun el formato", () => {
    expect(getDownloadMime("PDF")).toBe("application/pdf");
    expect(getDownloadMime("png")).toBe("image/png");
    expect(getDownloadMime("XLSX")).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(getDownloadMime("DOCX")).toBe("application/octet-stream");
  });
});

describe("getDownloadFileName", () => {
  it("agrega la extension del formato al titulo", () => {
    expect(getDownloadFileName("Resumen de Algebra", "PDF")).toBe("Resumen de Algebra.pdf");
    expect(getDownloadFileName("Notas del curso", "XLSX")).toBe("Notas del curso.xlsx");
  });

  it("no duplica la extension si el titulo ya la trae", () => {
    expect(getDownloadFileName("diagrama.png", "PNG")).toBe("diagrama.png");
  });

  it("limpia separadores de ruta y usa un nombre por defecto", () => {
    expect(getDownloadFileName("clase/parcial 1", "PDF")).toBe("clase-parcial 1.pdf");
    expect(getDownloadFileName("   ", "PDF")).toBe("material.pdf");
  });
});
