import type { Material } from "../../interfaces/material.interface";

export interface MaterialCardProps {
  material: Material;
}

export interface UploadMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subjects: Array<{ id: string; name: string }>;
}
