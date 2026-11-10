import axios from "axios";
import { httpClient } from "@/shared/lib/httpClient";

// Mismo endpoint que ya usa el alumno; el backend también lo permite al tutor dueño.
export async function getMaterialSignedUrl(materialId: string): Promise<string> {
  const { data } = await httpClient.get<string>(`/api/v1/materials/${materialId}/download`);
  return data;
}

/**
 * axios plano a propósito: NO usar httpClient (adjuntaría el Bearer del usuario
 * a Supabase). El MIME del Blob lo fija el mapeo de formato del frontend, nunca
 * el Content-Type de la respuesta.
 */
export async function fetchMaterialBlob(
  signedUrl: string,
  mimeType: string,
  signal?: AbortSignal
): Promise<Blob> {
  const { data } = await axios.get<Blob>(signedUrl, { responseType: "blob", signal });
  return new Blob([data], { type: mimeType });
}
