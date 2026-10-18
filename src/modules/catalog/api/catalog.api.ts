import { httpClient, rawHttpClient } from "@/shared/lib/httpClient";
import type { InstitutionResponse } from "@/modules/catalog/interfaces/responses/institution.interface";
import type { CatalogCareerResponse } from "@/modules/catalog/interfaces/responses/catalog-career.interface";
import type { CatalogSubjectResponse } from "@/modules/catalog/interfaces/responses/catalog-subject.interface";
import type { CreateSubjectRequest } from "@/modules/catalog/interfaces/requests/create-subject.interface";
import type { UpdateSubjectCareersRequest } from "@/modules/catalog/interfaces/requests/update-subject-careers.interface";

export async function getInstitutions(): Promise<InstitutionResponse[]> {
  const response = await httpClient.get<InstitutionResponse[]>("/api/v1/catalog/institutions");
  return response.data;
}

export async function getCareersByInstitution(
  institutionId: string,
): Promise<CatalogCareerResponse[]> {
  const response = await httpClient.get<CatalogCareerResponse[]>(
    `/api/v1/catalog/institutions/${institutionId}/careers`,
  );
  return response.data;
}

export async function getSubjectsByInstitutionAndCareer(
  institutionId: string,
  careerId?: string,
): Promise<CatalogSubjectResponse[]> {
  const response = await httpClient.get<CatalogSubjectResponse[]>("/api/v1/catalog/subjects", {
    params: careerId ? { institutionId, careerId } : { institutionId },
  });
  return response.data;
}

export async function createSubject(
  institutionId: string,
  data: CreateSubjectRequest,
): Promise<CatalogSubjectResponse> {
  const response = await rawHttpClient.post<CatalogSubjectResponse>(
    `/api/v1/catalog/institutions/${institutionId}/subjects`,
    data,
  );
  return response.data;
}

export async function updateSubjectCareers(
  subjectId: string,
  data: UpdateSubjectCareersRequest,
): Promise<CatalogSubjectResponse> {
  const response = await rawHttpClient.patch<CatalogSubjectResponse>(
    `/api/v1/catalog/subjects/${subjectId}/careers`,
    data,
  );
  return response.data;
}