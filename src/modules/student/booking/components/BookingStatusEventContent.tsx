import { useState } from "react";
import { Box } from "@mui/material";
import BookingValidationMessage from "@/modules/student/booking/components/BookingValidationMessage";

interface BookingStatusEventContentProps {
  timeText: string;
  message: string;
}

export default function BookingStatusEventContent({
  timeText,
  message,
}: BookingStatusEventContentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Box
      onMouseEnter={(event) => setAnchorEl(event.currentTarget)}
      onMouseLeave={() => setAnchorEl(null)}
      sx={{ px: 0.5, py: 0.25, fontSize: 12, fontWeight: 600, height: "100%" }}
    >
      {timeText}
      <BookingValidationMessage anchorEl={anchorEl} message={message} />
    </Box>
  );
}
