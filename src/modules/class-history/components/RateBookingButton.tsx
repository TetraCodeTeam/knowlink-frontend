import AppButton from "@/shared/components/AppButton";

interface RateBookingButtonProps {
    onClick: () => void;
}

export default function RateBookingButton({ onClick }: RateBookingButtonProps) {
    return (
        <AppButton appVariant="primary" onClick={onClick} sx={{ fontSize: "0.95rem", flexShrink: 0}}>
            Calificar
        </AppButton>
    );
}