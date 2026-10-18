import type { CatalogCareerResponse } from "@/modules/catalog/interfaces/responses/catalog-career.interface";
import type { AsociacionesFormData } from "@/modules/catalog/schemas/materia.schema";

export interface InstitutionSelectProps {
  value: string;
  onChange: (institutionId: string) => void;
  label?: string;
}

export interface CatalogSectionProps {
  institutionId: string;
}

export interface DuplicatedSubjectAlertProps {
  message: string;
  subjectName: string;
  onEditAssociations: () => void;
  onClose: () => void;
}
export interface CareerMultiSelectProps {
  careers: CatalogCareerResponse[] | undefined;
  value: string[];
  onChange: (careerIds: string[]) => void;
  error?: boolean;
  helperText?: string;
}
export interface SubjectAssociationsFormProps {
  subjectName: string;
  defaultCareerIds: string[];
  careers: CatalogCareerResponse[] | undefined;
  isPending: boolean;
  onSubmit: (data: AsociacionesFormData) => Promise<void>;
  onBack: () => void;
}
