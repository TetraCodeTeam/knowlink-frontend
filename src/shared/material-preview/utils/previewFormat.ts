export type PreviewKind = "pdf" | "image" | "unsupported";

export function getPreviewKind(format: string): PreviewKind {
  const f = format.toUpperCase();
  if (f === "PDF") return "pdf";
  if (f === "PNG") return "image";
  return "unsupported";
}

export const PREVIEW_MIME: Record<Exclude<PreviewKind, "unsupported">, string> = {
  pdf: "application/pdf",
  image: "image/png",
};

const DOWNLOAD_MIME: Record<string, string> = {
  PDF: "application/pdf",
  PNG: "image/png",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/** MIME del Blob de descarga: lo fija el formato del material, nunca el Content-Type. */
export function getDownloadMime(format: string): string {
  return DOWNLOAD_MIME[format.trim().toUpperCase()] ?? "application/octet-stream";
}

/** Nombre del archivo a guardar: título del material + extensión del formato. */
export function getDownloadFileName(title: string, format: string): string {
  const extension = format.trim().toLowerCase();
  const base =
    title
      .trim()
      .replace(/[\\/:*?"<>|]/g, "-")
      .trim() || "material";
  if (!extension || base.toLowerCase().endsWith(`.${extension}`)) return base;
  return `${base}.${extension}`;
}
