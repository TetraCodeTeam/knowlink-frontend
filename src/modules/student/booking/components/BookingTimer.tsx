import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Timer } from "lucide-react";

interface BookingCountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function computeSecondsLeft(expiresAt: string): number {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (!Number.isFinite(remainingMs)) return 0;
  return Math.max(0, Math.floor(remainingMs / 1000));
}

export default function BookingCountdownTimer({ expiresAt, onExpire }: BookingCountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => computeSecondsLeft(expiresAt));
  const hasExpiredRef = useRef(false);

  // Recalcula contra el reloj real en cada tick, no decrementa un contador
  // local — así funciona igual para una selección recién hecha (15 min
  // completos) que para una restaurada al volver a entrar (con lo que
  // quede real del hold), sin duplicar el "15 min" como constante propia
  // del front desincronizada de BookingConstants.HOLD_MINUTES del backend.
  useEffect(() => {
    const intervalId = setInterval(() => setSecondsLeft(computeSecondsLeft(expiresAt)), 1000);
    return () => clearInterval(intervalId);
  }, [expiresAt]);

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
