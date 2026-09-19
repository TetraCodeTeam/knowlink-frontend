import AppButton from "@/shared/components/AppButton";

interface CancelBookingButtonProps {
  onClick: () => void;
}

export default function CancelBookingButton({ onClick }: CancelBookingButtonProps) {
  return (
    <AppButton
      appVariant="soft-danger"
      onClick={onClick}
      sx={{ fontSize: "0.95rem", flexShrink: 0 }}
    >
      Cancelar
    </AppButton>
  );
}
