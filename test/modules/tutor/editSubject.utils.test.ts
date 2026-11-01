import { describe, expect, it } from "vitest";
import {
  toEditSubjectFormValues,
  toUpdateTutorSubjectRequest,
} from "@/modules/tutor/utils/editSubject.utils";
import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

const baseSubject: TutorOwnSubject = {
  tutorSubjectId: "ts-1",
  subjectName: "Física 1",
  averageRating: null,
  reviewCount: null,
  modality: "VIRTUAL",
  compensationType: "PAID",
  pricePerHour: 8000,
  verificationStatus: "ACTIVE",
  active: true,
};

describe("toEditSubjectFormValues", () => {
  it("mapea una materia paga de modalidad virtual", () => {
    expect(toEditSubjectFormValues(baseSubject)).toEqual({
      isFree: false,
      pricePerHour: "8000",
      virtualSelected: true,
      inPersonSelected: false,
    });
  });

  it("mapea una materia paga de modalidad presencial", () => {
    expect(toEditSubjectFormValues({ ...baseSubject, modality: "IN_PERSON" })).toMatchObject({
      virtualSelected: false,
      inPersonSelected: true,
    });
  });

  it("mapea una materia paga de modalidad ambas", () => {
    expect(toEditSubjectFormValues({ ...baseSubject, modality: "BOTH" })).toMatchObject({
      virtualSelected: true,
      inPersonSelected: true,
    });
  });

  it("deja el precio vacío cuando la materia es gratuita", () => {
    expect(
      toEditSubjectFormValues({
        ...baseSubject,
        compensationType: "FREE",
        pricePerHour: null,
      })
    ).toMatchObject({ isFree: true, pricePerHour: "" });
  });
});

describe("toUpdateTutorSubjectRequest", () => {
  it("arma la modalidad BOTH", () => {
    expect(
      toUpdateTutorSubjectRequest({
        isFree: false,
        pricePerHour: "8000",
        virtualSelected: true,
        inPersonSelected: true,
      })
    ).toEqual({ modality: "BOTH", compensationType: "PAID", pricePerHour: 8000 });
  });

  it("arma la modalidad VIRTUAL", () => {
    expect(
      toUpdateTutorSubjectRequest({
        isFree: false,
        pricePerHour: "8000",
        virtualSelected: true,
        inPersonSelected: false,
      })
    ).toEqual({ modality: "VIRTUAL", compensationType: "PAID", pricePerHour: 8000 });
  });

  it("arma la modalidad IN_PERSON", () => {
    expect(
      toUpdateTutorSubjectRequest({
        isFree: false,
        pricePerHour: "8000",
        virtualSelected: false,
        inPersonSelected: true,
      })
    ).toEqual({ modality: "IN_PERSON", compensationType: "PAID", pricePerHour: 8000 });
  });

  it("envía precio nulo cuando la materia es gratuita", () => {
    expect(
      toUpdateTutorSubjectRequest({
        isFree: true,
        pricePerHour: "8000",
        virtualSelected: true,
        inPersonSelected: false,
      })
    ).toEqual({ modality: "VIRTUAL", compensationType: "FREE", pricePerHour: null });
  });

  it("lanza un error si no hay modalidad seleccionada", () => {
    expect(() =>
      toUpdateTutorSubjectRequest({
        isFree: false,
        pricePerHour: "8000",
        virtualSelected: false,
        inPersonSelected: false,
      })
    ).toThrow("Seleccioná al menos una modalidad");
  });
});
