import type { CSSProperties } from "react";
import { Toaster } from "sonner";
import Frankie from "@/shared/frankie/Frankie";
import { MOOD_BY_KIND } from "@/shared/frankie/frankie.copy";
import "@/shared/frankie/frankie-toast.css";

const AVATAR_SIZE = 40;

// Sonner permite variables CSS propias; se tipan como `CSSProperties` para no usar `any`.
const toasterStyle = {
  "--normal-bg": "#ffffff",
  "--normal-border": "#e4e2f6",
  "--normal-text": "#1a1a2e",
  "--border-radius": "16px",
} as CSSProperties;

/** Avisos con la cara de Frankie: su expresión cambia según el tipo de mensaje. */
export function SnackbarProvider() {
  return (
    <Toaster
      position="bottom-right"
      duration={4500}
      closeButton
      style={toasterStyle}
      toastOptions={{ classNames: { toast: "kl-toast" } }}
      icons={{
        success: <Frankie mood={MOOD_BY_KIND.success} crop="face" size={AVATAR_SIZE} />,
        error: <Frankie mood={MOOD_BY_KIND.error} crop="face" size={AVATAR_SIZE} />,
        warning: <Frankie mood={MOOD_BY_KIND.warning} crop="face" size={AVATAR_SIZE} />,
        info: <Frankie mood={MOOD_BY_KIND.info} crop="face" size={AVATAR_SIZE} />,
        loading: <Frankie mood="thinking" crop="face" size={AVATAR_SIZE} />,
      }}
    />
  );
}
