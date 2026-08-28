import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Timer } from "lucide-react";

interface BookingCountdownTimerProps {
  durationSeconds?: number; // default: 15 min
  onExpire?: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function BookingCountdownTimer({
  durationSeconds = 15 * 60,
  onExpire,
}: BookingCountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const hasExpiredRef = useRef(false);

  // Un solo interval montado una vez; no depende de secondsLeft para no
  // reiniciarse cada segundo.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Efecto separado que solo observa cuándo llega a 0, para disparar
  // onExpire una única vez en dónde se cancela la reserva.
  useEffect(() => {
    if (secondsLeft === 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onExpire?.();
    }
  }, [secondsLeft, onExpire]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        bgcolor: "#C7C8FF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Timer size={22} color="#5865C8" />
        <Typography variant="subtitle1" sx={{ color: "#3A48AD", fontWeight: 600 }}>
          Tiempo Restante
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ color: "#3A48AD", fontWeight: 700 }}>
        {formatTime(secondsLeft)}
      </Typography>
    </Box>
  );
}