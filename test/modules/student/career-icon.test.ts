import { describe, expect, it } from "vitest";
import { Sigma } from "lucide-react";
import { getCareerIcon } from "@/modules/student/icons/career-icon";

describe("getCareerIcon", () => {
  it("usa el ícono de materias básicas para las materias compartidas", () => {
    expect(getCareerIcon("Materias compartidas")).toBe(Sigma);
  });

  it("reconoce la etiqueta sin distinguir mayúsculas ni tildes", () => {
    expect(getCareerIcon("MATERIAS COMPARTIDAS")).toBe(Sigma);
  });
});
