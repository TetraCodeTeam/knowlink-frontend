import type { AssociationMode } from "@/modules/catalog/types/association-mode.type";

export interface UpdateSubjectCareersRequest {
  careerIds: string[];
  mode?: AssociationMode;
}