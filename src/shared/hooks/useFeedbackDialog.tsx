import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FeedbackDialog, type FeedbackDialogVariant } from "@/shared/components/FeedbackDialog";

interface FeedbackDialogOptions {
  title: string;
  description: string;
  icon?: ReactNode;
  variant?: FeedbackDialogVariant;
  actionLabel?: string;
  /** Se ejecuta al cerrar el diálogo (además de cerrarlo) */
  onClose?: () => void;
}

export function useFeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<FeedbackDialogOptions | null>(null);

  const openFeedbackDialog = useCallback((opts: FeedbackDialogOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeFeedbackDialog = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  const handleClose = useCallback(() => {
    options?.onClose?.();
    closeFeedbackDialog();
  }, [options, closeFeedbackDialog]);

  // Este es el nodo que hay que renderizar en el JSX del componente que use el hook
  const feedbackDialog = useMemo(() => {
    if (!options) return null;

    return (
      <FeedbackDialog
        open={isOpen}
        title={options.title}
        description={options.description}
        icon={options.icon ?? null}
        variant={options.variant}
        actionLabel={options.actionLabel}
        onClose={handleClose}
      />
    );
  }, [isOpen, options, handleClose]);

  return { openFeedbackDialog, closeFeedbackDialog, feedbackDialog };
}