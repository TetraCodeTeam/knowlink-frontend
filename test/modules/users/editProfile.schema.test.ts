import { describe, expect, it } from "vitest";
import { createEditProfileSchema } from "@/modules/users/schemas/editProfile.schema";

const validValues = {
  firstName: "Ana",
  lastName: "García",
  dni: "40123456",
  phoneNumber: "3534123456",
  career: "Ingeniería en Sistemas de Información",
  institutionalId: "",
  biography: "",
  address: "Av. Siempre Viva 123",
};

function fieldErrors(values: unknown, requiresAddress = false) {
  const result = createEditProfileSchema(requiresAddress).safeParse(values);
  return result.success ? {} : result.error.flatten().fieldErrors;
}

describe("createEditProfileSchema", () => {
  it("acepta datos completos válidos", () => {
    const result = createEditProfileSchema(false).safeParse(validValues);

    expect(result.success).toBe(true);
  });

  it("exige nombre, apellido y teléfono con mensaje por campo", () => {
    const errors = fieldErrors({
      ...validValues,
      firstName: "",
      lastName: "   ",
      phoneNumber: "",
    });

    expect(errors.firstName).toContain("El nombre es obligatorio");
    expect(errors.lastName).toContain("El apellido es obligatorio");
    expect(errors.phoneNumber).toContain("El teléfono es obligatorio");
  });

  it("rechaza DNI con menos de 7 dígitos", () => {
    const errors = fieldErrors({ ...validValues, dni: "123" });

    expect(errors.dni).toContain("El DNI debe tener 7 u 8 dígitos");
  });

  it("rechaza DNI con más de 8 dígitos", () => {
    const errors = fieldErrors({ ...validValues, dni: "123456789" });

    expect(errors.dni).toContain("El DNI debe tener 7 u 8 dígitos");
  });

  it("rechaza DNI con letras", () => {
    const errors = fieldErrors({ ...validValues, dni: "12a45678" });

    expect(errors.dni).toContain("El DNI debe tener 7 u 8 dígitos");
  });

  it("acepta un DNI de 8 dígitos", () => {
    const result = createEditProfileSchema(false).safeParse({
      ...validValues,
      dni: "40123456",
    });

    expect(result.success).toBe(true);
  });

  it("exige la carrera", () => {
    const errors = fieldErrors({ ...validValues, career: "" });

    expect(errors.career).toContain("La carrera es obligatoria");
  });

  it("acepta el legajo institucional vacío", () => {
    const result = createEditProfileSchema(false).safeParse({
      ...validValues,
      institutionalId: "",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza una biografía de 301 caracteres", () => {
    const errors = fieldErrors({ ...validValues, biography: "a".repeat(301) });

    expect(errors.biography).toContain("La biografía no puede superar los 300 caracteres");
  });

  it("acepta una biografía de 300 caracteres", () => {
    const result = createEditProfileSchema(false).safeParse({
      ...validValues,
      biography: "a".repeat(300),
    });

    expect(result.success).toBe(true);
  });

  it("exige la dirección cuando el tutor tiene clases presenciales", () => {
    const errors = fieldErrors({ ...validValues, address: "   " }, true);

    expect(errors.address).toContain("La dirección es obligatoria para clases presenciales");
  });

  it("no exige la dirección cuando no hay clases presenciales", () => {
    const result = createEditProfileSchema(false).safeParse({ ...validValues, address: "" });

    expect(result.success).toBe(true);
  });
});
