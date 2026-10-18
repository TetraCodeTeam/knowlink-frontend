import type { CareerType } from "@/modules/catalog/types/career-type.type";

export interface CatalogCareerResponse {
  careerId: string;
  name: string;
  type: CareerType;
}