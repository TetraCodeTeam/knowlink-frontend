import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudentSupport } from "@/modules/student/support/api/studentSupport.api";
import { SUPPORT_UNREAD_COUNT_QUERY_KEY } from "@/modules/student/support/hooks/useSupportUnreadCount";

export function useStudentSupport() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["studentSupport"],
    queryFn: getStudentSupport,
  });

  useEffect(() => {
    if (isSuccess) {
      void queryClient.invalidateQueries({ queryKey: SUPPORT_UNREAD_COUNT_QUERY_KEY });
    }
  }, [isSuccess, queryClient]);

  return {
    summary: data?.summary,
    claims: data?.sessionClaims ?? [],
    materials: data?.reportedMaterials ?? [],
    isLoading,
    isError,
    refetch,
  };
}
