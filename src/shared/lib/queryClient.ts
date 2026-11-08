import { QueryClient, QueryCache } from "@tanstack/react-query";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";
import { getErrorMessage, isRatingRequiredError } from "@/shared/utils/errors";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown, query) => {
      if (query.meta?.silent || isRatingRequiredError(error)) return;

      useSnackbarStore
        .getState()
        .showMessage(getErrorMessage(error, "Ocurrió un error inesperado"), "error");
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => !isRatingRequiredError(error) && failureCount < 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});
