/** Lo mínimo que el visor necesita saber de un material, sin importar tipos
 * de los módulos que lo usan. */
export interface PreviewableMaterial {
  id: string;
  title: string;
  format: string;
}

export interface MaterialPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  material: PreviewableMaterial | null;
}
