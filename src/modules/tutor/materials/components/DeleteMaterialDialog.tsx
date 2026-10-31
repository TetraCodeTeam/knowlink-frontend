import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { useDeleteMaterial } from "@/modules/tutor/materials/hooks/useDeleteMaterial";
import { DELETE_MATERIAL_MESSAGES } from "@/modules/tutor/materials/constants/materials.constants";
import {
  getMaterialDisplayName,
  isTerminalDeleteError,
} from "@/modules/tutor/materials/utils/materials.utils";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";

interface DeleteMaterialDialogProps {
  open: boolean;
  material: Material;
  onClose: () => void;
}

export default function DeleteMaterialDialog({
  open,
  material,
  onClose,
}: DeleteMaterialDialogProps) {
  const { deleteMaterial, isPending } = useDeleteMaterial();
  const displayName = getMaterialDisplayName(material);

  const handleCancel = () => {
    if (isPending) return;
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await deleteMaterial(material.id);
      onClose();
    } catch (error) {
      // A 502 (or a network error) keeps the dialog open so the tutor can retry.
      if (isTerminalDeleteError(error)) onClose();
    }
  };

  return (
    <AppConfirmDialog
      open={open}
      title={DELETE_MATERIAL_MESSAGES.title}
      message={DELETE_MATERIAL_MESSAGES.confirm(displayName)}
      severity="danger"
      confirmLabel={DELETE_MATERIAL_MESSAGES.confirmLabel}
      cancelLabel={DELETE_MATERIAL_MESSAGES.cancelLabel}
      onConfirm={() => void handleConfirm()}
      onCancel={handleCancel}
      isPending={isPending}
    />
  );
}
