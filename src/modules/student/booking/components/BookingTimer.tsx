import CountdownTimer from "@/shared/components/CountdownTimer";

interface BookingCountdownTimerProps {
  durationSeconds?: number; // default: 15 min
  backgroundColor?: string;
  borderColor?: string;
  strokeColor?: string;
  textColor?: string;
  onExpire?: () => void;
}

export default function BookingCountdownTimer({
  durationSeconds = 15 * 60,
  backgroundColor,
  borderColor,
  strokeColor,
  textColor,
  onExpire,
}: BookingCountdownTimerProps) {
  return (
    <CountdownTimer
      durationSeconds={durationSeconds}
      label="Tiempo restante"
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      strokeColor={strokeColor}
      textColor={textColor}
      onExpire={onExpire}
    />
  );
}
