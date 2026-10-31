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
