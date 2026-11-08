import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingRatings } from "@/modules/class-history/api/ratingGate.api";
import {
  RATING_GATE_POLL_INTERVAL,
  RATING_GATE_QUERY_KEYS,
} from "@/modules/class-history/constants/ratingGate.constants";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

export function usePendingRatings() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.authResponse?.role);
  const enabled = isAuthenticated && (role === "STUDENT" || role === "TUTOR");
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: RATING_GATE_QUERY_KEYS.pending,
    queryFn: getPendingRatings,
    enabled,
    staleTime: 0,
    refetchInterval: RATING_GATE_POLL_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
    meta: { silent: true },
  });

  const blocking = data?.blocking ?? [];
  const current = blocking[0] ?? null;
  const total = blocking.length;
  const nextBlockAt = data?.nextBlockAt ?? null;

  const hadBlocking = useRef(false);

  useEffect(() => {
    if (hadBlocking.current && total === 0) {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== RATING_GATE_QUERY_KEYS.all[0],
      });
    }
    hadBlocking.current = total > 0;
  }, [total, queryClient]);

  useEffect(() => {
    if (current || !nextBlockAt) return undefined;

    const delay = Math.max(1_000, new Date(nextBlockAt).getTime() - Date.now() + 1_000);
    const timer = setTimeout(() => {
      void refetch();
    }, delay);

    return () => clearTimeout(timer);
  }, [current, nextBlockAt, refetch]);

  return { blocking, current, total, nextBlockAt };
}
