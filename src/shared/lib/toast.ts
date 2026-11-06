import { toast as sonnerToast } from "sonner";
import { pickHeadline, type FeedbackKind } from "@/shared/frankie/frankie.copy";

interface ToastOptions {
  /** Identificador para no duplicar un aviso: si ya hay uno con el mismo `id`, se reemplaza. */
  id?: string | number;
}

/**
 * Avisos de KnowLink: envuelven a `sonner` para que cada uno lleve un encabezado de Frankie y su
 * cara (ver `SnackbarProvider`). La API es la misma de antes: `toast.success("mensaje")`.
 *
 * El mensaje que se pasa es el detalle; el encabezado lo pone Frankie. Así los textos que
 * vienen del backend o de cada pantalla no cambian.
 */
function show(kind: FeedbackKind, message: string, options?: ToastOptions) {
  return sonnerToast[kind](pickHeadline(kind), { description: message, id: options?.id });
}

export const toast = {
  success: (message: string, options?: ToastOptions) => show("success", message, options),
  error: (message: string, options?: ToastOptions) => show("error", message, options),
  warning: (message: string, options?: ToastOptions) => show("warning", message, options),
  info: (message: string, options?: ToastOptions) => show("info", message, options),
  dismiss: sonnerToast.dismiss,
};
