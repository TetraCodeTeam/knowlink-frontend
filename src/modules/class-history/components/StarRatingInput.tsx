import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Star } from "lucide-react";

const STAR_COUNT = 5;
const INACTIVE_COLOR = "#676767";
const ACTIVE_COLOR = "#E4CF8C";

interface StarRatingInputProps {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}

export default function StarRatingInput({ value, onChange, disabled }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <Box
      sx={{ display: "flex", gap: "6px", justifyContent: "center" }}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((star) => {
        const active = star <= displayValue;
        return (
          <IconButton
            key={star}
            size="small"
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
            sx={{ p: "4px" }}
          >
            <Star
              size={32}
              color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
              fill={active ? ACTIVE_COLOR : "none"}
            />
          </IconButton>
        );
      })}
    </Box>
  );
}
