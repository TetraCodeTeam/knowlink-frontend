import { useQueries } from "@tanstack/react-query";
import { getMaterialsBySubject } from "@/modules/tutor/materials/api/materials.api";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

// subjectIds: all tutorSubjectIds of the tutor (used when selectedSubjectId is undefined = "Todo")
// selectedSubjectId: if set, fetches only that subject
export function useGetMaterials(subjectIds: string[], selectedSubjectId?: string) {
  const idsToFetch = selectedSubjectId ? [selectedSubjectId] : subjectIds;

  const results = useQueries({
    queries: idsToFetch.map((id) => ({
      queryKey: ["materials", id] as const,
      queryFn: () => getMaterialsBySubject(id),
      enabled: idsToFetch.length > 0,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const materials: Material[] = results.flatMap((r) => r.data ?? []);
  const isLoading = results.some((r) => r.isLoading);

  return { materials, isLoading };
}
