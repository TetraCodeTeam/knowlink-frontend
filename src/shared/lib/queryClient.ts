import { QueryClient, QueryCache } from "@tanstack/react-query";
import { useSnackbarStore } from "@/shared/hooks/useSnackbarStore";
import { getErrorMessage } from "@/shared/utils/errors";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      useSnackbarStore.getState().showMessage(getErrorMessage(error, "Ocurrió un error inesperado"), "error");
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});