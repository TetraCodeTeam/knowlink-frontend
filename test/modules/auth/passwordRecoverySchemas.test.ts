import { describe, expect, it } from "vitest";
import { forgotPasswordSchema } from "@/modules/auth/schemas/forgot-password.schema";
import { resetPasswordSchema } from "@/modules/auth/schemas/reset-password.schema";

function issues(newPassword: string, confirmNewPassword = newPassword) {
  const result = resetPasswordSchema.safeParse({ newPassword, confirmNewPassword });
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("forgotPasswordSchema", () => {
  it("CP-034.F1 - rechaza email vacío e inválido", () => {
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "abc" }).success).toBe(false);
  });

  it("CP-034.F2 - acepta un email válido", () => {
    expect(forgotPasswordSchema.safeParse({ email: "ana@test.com" }).success).toBe(true);
  });
});

describe("resetPasswordSchema (mismas reglas que el registro)", () => {
  it("CP-034.F3 - rechaza menos de 8 caracteres", () => {
    expect(issues("Ab#1")).toContain("La contraseña debe tener al menos 8 caracteres");
  });

  it.each([
    ["sin mayúscula", "nueva#123"],
    ["sin minúscula", "NUEVA#123"],
    ["sin carácter especial", "Nueva1234"],
  ])("CP-034.F4 - rechaza contraseña %s", (_motivo, password) => {
    expect(issues(password)).toContain("Usá mayúsculas, minúsculas y un carácter especial");
  });

  it("CP-034.F5 - rechaza confirmación distinta", () => {
    expect(issues("Nueva#123", "Nueva#124")).toContain("Las contraseñas no coinciden");
  });

  it("CP-034.F6 - acepta una contraseña válida confirmada", () => {
    expect(issues("Nueva#123")).toEqual([]);
  });
});
