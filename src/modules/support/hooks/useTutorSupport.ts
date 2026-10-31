import { useQuery } from "@tanstack/react-query";
import { getTutorSupport } from "@/modules/support/api/tutorSupport.api";

export function useTutorSupport() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tutorSupport"],
    queryFn: getTutorSupport,
  });

  return {
    support: data,
    claims: data?.claims ?? [],
    materials: data?.materials ?? [],
    isLoading,
    isError,
    refetch,
  };
}
