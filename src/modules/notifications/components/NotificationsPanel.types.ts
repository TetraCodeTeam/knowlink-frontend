export interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  /** Alto del topbar: el panel se abre debajo para dejar la campana a la vista. */
  topOffset: number;
}
