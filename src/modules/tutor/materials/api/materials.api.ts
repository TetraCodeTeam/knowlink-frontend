import { httpClient } from "@/shared/lib/httpClient";
import type { Material, CreateMaterialRequest } from "@/modules/tutor/materials/interfaces/material.interface";

const MIME_TYPES: Record<string, string> = {
  PDF: "application/pdf",
  PNG: "image/png",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export async function getMaterialsBySubject(subjectId: string): Promise<Material[]> {
  const response = await httpClient.get<Material[]>("/api/v1/materials", {
    params: { subjectId },
  });
  return response.data;
}

export async function uploadMaterial(data: CreateMaterialRequest): Promise<Material> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("subjectId", data.subjectId);

  const ext = data.file.name.split(".").pop()?.toUpperCase() ?? "";
  const correctMimeType = MIME_TYPES[ext] ?? data.file.type;
  const file =
    data.file.type === correctMimeType
      ? data.file
      : new File([data.file], data.file.name, { type: correctMimeType });
  formData.append("file", file);

  const response = await httpClient.post<Material>("/api/v1/materials", formData);
  return response.data;
}
