import { describe, expect, it } from "vitest";
import { editSubjectSchema } from "@/modules/tutor/schemas/editSubject.schema";

const validValues = {
  isFree: false,
  pricePerHour: "8000",
  virtualSelected: true,
  inPersonSelected: false,
};

function priceErrors(values: typeof validValues) {
  const result = editSubjectSchema.safeParse(values);
  if (result.success) return [];

  return result.error.issues.filter((issue) => issue.path[0] === "pricePerHour");
}

describe("editSubjectSchema", () => {
  it("acepta una materia paga con precio válido", () => {
    expect(editSubjectSchema.safeParse(validValues).success).toBe(true);
  });

  it("rechaza un precio vacío cuando la materia es paga", () => {
    const errors = priceErrors({ ...validValues, pricePerHour: "" });

    expect(errors.map((error) => error.message)).toContain("Ingresá el precio por hora");
  });

  it("rechaza un precio en cero o negativo", () => {
    for (const pricePerHour of ["0", "-5"]) {
      const errors = priceErrors({ ...validValues, pricePerHour });

      expect(errors.map((error) => error.message)).toContain("El precio debe ser mayor a cero");
    }
  });

  it("rechaza un precio no numérico", () => {
    const errors = priceErrors({ ...validValues, pricePerHour: "abc" });

    expect(errors.map((error) => error.message)).toContain("Ingresá un valor numérico válido");
  });

  it("rechaza precios con más de dos decimales o más de ocho dígitos enteros", () => {
    for (const pricePerHour of ["10.999", "123456789"]) {
      const errors = priceErrors({ ...validValues, pricePerHour });

      expect(errors.map((error) => error.message)).toContain(
        "Usá hasta 8 dígitos enteros y 2 decimales"
      );
    }
  });

  it("acepta una materia gratuita sin precio", () => {
    expect(
      editSubjectSchema.safeParse({ ...validValues, isFree: true, pricePerHour: "" }).success
    ).toBe(true);
  });

  it("exige al menos una modalidad", () => {
    const result = editSubjectSchema.safeParse({
      ...validValues,
      virtualSelected: false,
      inPersonSelected: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((error) => error.path[0] === "virtualSelected");
      expect(issue?.message).toBe("Seleccioná al menos una modalidad");
    }
  });
});
