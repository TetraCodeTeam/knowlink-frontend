import CountdownTimer from "@/shared/components/CountdownTimer";

interface BookingCountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

export default function BookingCountdownTimer({ expiresAt, onExpire }: BookingCountdownTimerProps) {
  return <CountdownTimer expiresAt={expiresAt} onExpire={onExpire} />;
}