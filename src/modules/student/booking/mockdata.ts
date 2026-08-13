// Mock temporal: reemplazar cuando exista  el endpoint real de materias.
export type Modality = "VIRTUAL" | "IN_PERSON";

export interface MockSubject {
  id: string;
  name: string;
  hourlyRate: number;
  availableModalities: Modality[]; // <-- nuevo campo
}

export const MOCK_SUBJECTS: MockSubject[] = [
  { id: "matematica-i", name: "Matemática I", hourlyRate: 3500, availableModalities: ["IN_PERSON"] },
  { id: "algoritmos", name: "Algoritmos y Estructuras de Datos", hourlyRate: 4200, availableModalities: ["VIRTUAL"] },
  { id: "fisica-ii", name: "Física II", hourlyRate: 3800, availableModalities: ["VIRTUAL", "IN_PERSON"] },
  { id: "bases-de-datos", name: "Bases de Datos", hourlyRate: 4000, availableModalities: ["VIRTUAL"] },
];

export const SERVICE_FEE_RATE = 0.03;
