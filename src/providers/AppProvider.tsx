import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CssBaseline, ThemeProvider } from "@mui/material";

import RoutesProvider from "@/providers/RoutesProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";
import { queryClient } from "@/shared/lib/queryClient";
import theme from "@/theme";


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