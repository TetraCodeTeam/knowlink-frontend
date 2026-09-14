import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Timer } from "lucide-react";

interface CountdownTimerProps {
  durationSeconds?: number;
  expiresAt?: string | number | Date;
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
  strokeColor?: string;
  textColor?: string;
  onExpire?: () => void;
}

function resolveDeadline(durationSeconds: number, expiresAt?: string | number | Date): number {
  if (expiresAt !== undefined) {
    return new Date(expiresAt).getTime();
  }

  return Date.now() + durationSeconds * 1000;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function CountdownTimer({
  durationSeconds = 15 * 60,
  expiresAt,
  label = "Tiempo restante",
  backgroundColor = "#C7C8FF",
  borderColor,
  strokeColor = "#5865C8",
  textColor = "#3A48AD",
  onExpire,
}: CountdownTimerProps) {
  const [deadline, setDeadline] = useState(() => resolveDeadline(durationSeconds, expiresAt));
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
  );
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    const nextDeadline = resolveDeadline(durationSeconds, expiresAt);
    setDeadline(nextDeadline);
    setSecondsLeft(Math.max(0, Math.ceil((nextDeadline - Date.now()) / 1000)));
    hasExpiredRef.current = false;
  }, [durationSeconds, expiresAt]);

  useEffect(() => {
    const updateRemainingTime = () => {
      setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [deadline]);

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
        bgcolor: backgroundColor,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Timer size={22} color={strokeColor} />
        <Typography variant="subtitle1" sx={{ color: textColor, fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ color: textColor, fontWeight: 700 }}>
        {formatTime(secondsLeft)}
      </Typography>
    </Box>
  );
}
