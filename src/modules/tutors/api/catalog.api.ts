import { httpClient } from "@/shared/lib/http-client";

export interface CareerOption {
  careerId: string;
  name: string;
}

export interface SubjectOption {
  subjectId: string;
  name: string;
  isBasic: boolean;
}

export async function getCareers(): Promise<CareerOption[]> {
  const response = await httpClient.get<CareerOption[]>("/api/v1/careers");
  return response.data;
}

export async function getBasicSubjects(): Promise<SubjectOption[]> {
  const response = await httpClient.get<SubjectOption[]>("/api/v1/subjects/basic");
  return response.data;
}

export async function getSubjectsByCareer(careerId: string): Promise<SubjectOption[]> {
  const response = await httpClient.get<SubjectOption[]>("/api/v1/subjects", {
    params: { careerId },
  });
  return response.data;
}