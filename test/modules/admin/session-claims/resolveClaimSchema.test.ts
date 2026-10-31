import { describe, expect, it } from "vitest";
import { resolveClaimSchema } from "@/modules/admin/session-claims/schemas/resolve-claim.schema";

describe("resolveClaimSchema", () => {
  it("exige elegir a favor de quién se resuelve", () => {
    const result = resolveClaimSchema.safeParse({ justification: "Se verificó la asistencia." });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Elegí a favor de quién resolver");
    }
  });

  it("rechaza una justificación vacía o de solo espacios", () => {
    const empty = resolveClaimSchema.safeParse({ favoredParty: "TUTOR", justification: "" });
    const blank = resolveClaimSchema.safeParse({ favoredParty: "TUTOR", justification: "   " });

    expect(empty.success).toBe(false);
    expect(blank.success).toBe(false);
    if (!blank.success) {
      expect(blank.error.issues[0]?.message).toBe("La justificación es obligatoria");
    }
  });

  it("acepta una parte válida y una justificación con contenido", () => {
    const result = resolveClaimSchema.safeParse({
      favoredParty: "STUDENT",
      justification: "  El tutor no se presentó a la sesión.  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.justification).toBe("El tutor no se presentó a la sesión.");
    }
  });

  it("limita el largo máximo de la justificación", () => {
    const result = resolveClaimSchema.safeParse({
      favoredParty: "STUDENT",
      justification: "a".repeat(501),
    });

    expect(result.success).toBe(false);
  });
});