import {
  ATTACHMENT_EXTENSIONS,
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_MAX_MB,
} from "@/modules/community/constants/community.constants";

/** Devuelve el motivo por el que el archivo no se puede adjuntar, o null si es válido. */
export function validateAttachment(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(ATTACHMENT_EXTENSIONS as readonly string[]).includes(extension)) {
    return "Formato no permitido. Podés adjuntar PDF, JPG, PNG o XLSX.";
  }
  if (file.size === 0) {
    return "El archivo adjunto no puede estar vacío.";
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    return `El archivo no puede superar los ${ATTACHMENT_MAX_MB} MB.`;
  }
  return null;
}
