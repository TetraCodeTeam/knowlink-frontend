import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";
import type { UpdateTutorSubjectRequest } from "@/modules/tutor/interfaces/UpdateTutorSubjectRequest";
import type { EditSubjectFormValues } from "@/modules/tutor/schemas/editSubject.schema";

export function toEditSubjectFormValues(subject: TutorOwnSubject): EditSubjectFormValues {
  const isFree = subject.compensationType === "FREE";

  return {
    isFree,
    pricePerHour: isFree || subject.pricePerHour == null ? "" : String(subject.pricePerHour),
    virtualSelected: subject.modality === "VIRTUAL" || subject.modality === "BOTH",
    inPersonSelected: subject.modality === "IN_PERSON" || subject.modality === "BOTH",
  };
}

/**
 * Indica si los datos editables difieren de los originales. Compara el precio como número, así que
 * escribir "8000.00" donde había "8000" no cuenta como un cambio, y el precio se ignora si es gratis.
 */
export function hasEditSubjectChanges(
  initial: EditSubjectFormValues,
  current: EditSubjectFormValues
): boolean {
  if (initial.isFree !== current.isFree) return true;
  if (initial.virtualSelected !== current.virtualSelected) return true;
  if (initial.inPersonSelected !== current.inPersonSelected) return true;
  if (current.isFree) return false;
  return Number(initial.pricePerHour.trim()) !== Number(current.pricePerHour.trim());
}

export function toUpdateTutorSubjectRequest(
  values: EditSubjectFormValues
): UpdateTutorSubjectRequest {
  let modality: UpdateTutorSubjectRequest["modality"];

  if (values.virtualSelected && values.inPersonSelected) {
    modality = "BOTH";
  } else if (values.virtualSelected) {
    modality = "VIRTUAL";
  } else if (values.inPersonSelected) {
    modality = "IN_PERSON";
  } else {
    throw new Error("Seleccioná al menos una modalidad");
  }

  return {
    modality,
    compensationType: values.isFree ? "FREE" : "PAID",
    pricePerHour: values.isFree ? null : Number(values.pricePerHour.trim()),
  };
}
