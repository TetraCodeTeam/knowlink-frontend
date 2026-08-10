import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CssBaseline, ThemeProvider } from "@mui/material";

import RoutesProvider from "@/providers/RoutesProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";
import { useSnackbarStore } from "@/shared/hooks/use-snackbar-store";
import theme from "@/theme";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Ocurrió un error inesperado";
      useSnackbarStore.getState().showMessage(msg, "error");
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function AppProvider() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <CssBaseline />
            <RoutesProvider />
            <SnackbarProvider />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}