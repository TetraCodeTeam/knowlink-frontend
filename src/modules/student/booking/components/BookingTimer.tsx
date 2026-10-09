import CountdownTimer from "@/shared/components/CountdownTimer";

interface BookingCountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

/**
 * Timer de una reserva en curso. Calcula el tiempo restante contra el reloj
 * real a partir de expiresAt (no decrementa un contador local), así funciona
 * igual para una selección recién hecha (15 min completos) que para una
 * restaurada al volver a entrar (con lo que quede real del hold), sin
 * duplicar el "15 min" como constante propia del front desincronizada de
 * BookingConstants.HOLD_MINUTES del backend.
 *
 * Toda la lógica de cuenta regresiva vive en CountdownTimer; este componente
 * solo le pasa la fecha de vencimiento.
 */
export default function BookingCountdownTimer({ expiresAt, onExpire }: BookingCountdownTimerProps) {
  return <CountdownTimer expiresAt={expiresAt} label="Tiempo restante" onExpire={onExpire} />;
}