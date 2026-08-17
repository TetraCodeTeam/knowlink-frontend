import { Tooltip } from "@mui/material";
import type { InfoTooltipProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";

// Tooltip para mostrar el motivo por el que un slot no está disponible.

export default function LockedSlotTooltip({ message, children }: InfoTooltipProps) {
  return (
    <Tooltip
      title={message}
      arrow
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "#fff",
            color: "text.primary",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: "center",
            borderRadius: 2,
            px: 1.75,
            py: 1.25,
            maxWidth: 200,
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.15)",
            border: "1px solid #ececf4",
          },
        },
        arrow: {
          sx: {
            color: "#fff",
            "&::before": {
              border: "1px solid #ececf4",
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
