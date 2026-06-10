import { Toaster } from "sonner";

export function SnackbarProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      duration={4000}
      closeButton
    />
  );
}
