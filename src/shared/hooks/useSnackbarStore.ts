import { toast } from "sonner";
import { create } from "zustand";

type Severity = "success" | "error" | "warning" | "info";

interface SnackbarStore {
  showMessage: (message: string, severity?: Severity) => void;
}

export const useSnackbarStore = create<SnackbarStore>()(() => ({
  showMessage: (message: string, severity: Severity = "info") => {
    switch (severity) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  },
}));
