import type { TutorModality, TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function toModalityList(modality: TutorModality): ("VIRTUAL" | "IN_PERSON")[] {
  return modality === "BOTH" ? ["VIRTUAL", "IN_PERSON"] : [modality];
}

export function getUniqueModalities(subjects: TutorOwnSubject[]): ("VIRTUAL" | "IN_PERSON")[] {
  const expanded = subjects.flatMap((s) => toModalityList(s.modality));
  return [...new Set(expanded)] as ("VIRTUAL" | "IN_PERSON")[];
}
