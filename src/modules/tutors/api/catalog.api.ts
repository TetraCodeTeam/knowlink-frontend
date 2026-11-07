import { httpClient } from "@/shared/lib/httpClient";

export interface InstitutionOption {
  institutionId: string;
  name: string;
}

export interface CareerOption {
  careerId: string;
  name: string;
}

export interface SubjectOption {
  subjectId: string;
  name: string;
  isBasic: boolean;
}

export async function getInstitutions(): Promise<InstitutionOption[]> {
  const response = await httpClient.get<InstitutionOption[]>("/api/v1/institutions");
  return response.data;
}

export async function getCareers(institutionId: string): Promise<CareerOption[]> {
  const response = await httpClient.get<CareerOption[]>("/api/v1/careers", {
    params: { institutionId },
  });
  return response.data;
}

export async function getBasicSubjects(institutionId: string): Promise<SubjectOption[]> {
  const response = await httpClient.get<SubjectOption[]>("/api/v1/subjects/basic", {
    params: { institutionId },
  });
  return response.data;
}

export async function getSubjectsByCareer(careerId: string): Promise<SubjectOption[]> {
  const response = await httpClient.get<SubjectOption[]>("/api/v1/subjects", {
    params: { careerId },
  });
  return response.data;
}
