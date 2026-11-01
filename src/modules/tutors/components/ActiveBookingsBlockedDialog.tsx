import { useNavigate } from "react-router-dom";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { MY_BOOKINGS_ROUTE } from "@/modules/tutors/constants";

interface ActiveBookingsBlockedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ActiveBookingsBlockedDialog({
  open,
  onClose,
}: ActiveBookingsBlockedDialogProps) {
  const navigate = useNavigate();

  const handleGoToBookings = () => {
    onClose();
    navigate(MY_BOOKINGS_ROUTE);
  };

  return (
    <AppConfirmDialog
      open={open}
      title="Reservas activas"
      message="No podés desactivar esta materia porque tiene reservas activas. Cancelalas o esperá a que se completen para poder desactivarla."
      severity="warning"
      confirmLabel="Ir a Mis reservas"
      cancelLabel="Cerrar"
      onConfirm={handleGoToBookings}
      onCancel={onClose}
      isPending={false}
    />
  );
}
