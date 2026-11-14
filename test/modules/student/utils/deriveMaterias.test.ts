import { describe, expect, it } from "vitest";
import type {
  SubjectSummary,
  TutorSearchResult,
} from "@/modules/student/interfaces/tutor-search-result.interface";
import { deriveMateriasFromTutors } from "@/modules/student/utils/derive-materias";

const CAREER = "Ingeniería en Sistemas";

function tutorConMaterias(...names: string[]): TutorSearchResult {
  const subjects: SubjectSummary[] = names.map((name) => ({ name, career: CAREER }));
  return {
    tutorId: `t-${names.join("-")}`,
    fullName: "Tutor de Prueba",
    photoProfile: null,
    averageRating: null,
    totalReviews: 0,
    subjects,
  };
}

function nombres(materias: SubjectSummary[]): string[] {
  return materias.map((materia) => materia.name);
}

describe("deriveMateriasFromTutors — US-06 ajustes de búsqueda", () => {
  it("deduplica materias repetidas entre tutores (case-insensitive)", () => {
    const materias = deriveMateriasFromTutors([
      tutorConMaterias("Álgebra"),
      tutorConMaterias("álgebra", "Física"),
    ]);

    expect(nombres(materias)).toEqual(["Álgebra", "Física"]);
  });

  it("con query ordena por rango: empieza → otra palabra → contiene → no contiene", () => {
    const materias = deriveMateriasFromTutors(
      [tutorConMaterias("Álgebra", "Historia Ana", "Managua", "Análisis")],
      "ana"
    );

    expect(nombres(materias)).toEqual(["Análisis", "Historia Ana", "Managua", "Álgebra"]);
  });

  it("con query prioriza las que empiezan con el texto buscado", () => {
    const materias = deriveMateriasFromTutors(
      [tutorConMaterias("Base de Datos", "Álgebra", "Análisis", "Cálculo")],
      "a"
    );

    expect(nombres(materias)).toEqual(["Álgebra", "Análisis", "Base de Datos", "Cálculo"]);
  });

  it("dentro del mismo rango desempata alfabéticamente en español", () => {
    const materias = deriveMateriasFromTutors([tutorConMaterias("Análisis", "Algoritmos")], "a");

    expect(nombres(materias)).toEqual(["Algoritmos", "Análisis"]);
  });

  it("normaliza acentos: 'algebra' ordena primero a 'Álgebra'", () => {
    const materias = deriveMateriasFromTutors(
      [tutorConMaterias("Física", "Álgebra", "Algoritmos")],
      "algebra"
    );

    expect(nombres(materias)).toEqual(["Álgebra", "Algoritmos", "Física"]);
  });

  it("sin query ordena alfabéticamente", () => {
    const materias = deriveMateriasFromTutors([tutorConMaterias("Cálculo", "Álgebra", "Física")]);

    expect(nombres(materias)).toEqual(["Álgebra", "Cálculo", "Física"]);
  });

  it("con query en blanco se comporta como sin query (alfabético)", () => {
    const materias = deriveMateriasFromTutors([tutorConMaterias("Cálculo", "Álgebra")], "   ");

    expect(nombres(materias)).toEqual(["Álgebra", "Cálculo"]);
  });

  it("conserva las materias que no matchean la query (van al final)", () => {
    const materias = deriveMateriasFromTutors(
      [tutorConMaterias("Química", "Álgebra")],
      "algebra"
    );

    expect(nombres(materias)).toEqual(["Álgebra", "Química"]);
  });

  it("devuelve una lista vacía cuando no hay tutores", () => {
    expect(deriveMateriasFromTutors([], "alg")).toEqual([]);
  });
});