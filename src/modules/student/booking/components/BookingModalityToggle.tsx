import { Box } from "@mui/material";
import { XCircle } from "lucide-react";
import type { ModalityToggleProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { Modality } from "@/modules/student/booking/interfaces/modalityType";

const MODALITY_OPTIONS: Modality[] = ["VIRTUAL", "IN_PERSON"];

const MODALITY_LABEL: Record<Modality, string> = {
  VIRTUAL: "Virtual",
  IN_PERSON: "Presencial",
};

export default function BookingModalityToggle({
  value,
  onChange,
  availableModalities,
}: ModalityToggleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        p: 1,
        borderRadius: 3,
        bgcolor: "#E0E0FA",
      }}
    >
      {MODALITY_OPTIONS.map((option) => {
        const isSelected = value === option;
        const isDisabled = !availableModalities.includes(option);

        return (
          <Box
            key={option}
            component="button"
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(option)}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              border: "none",
              borderRadius: 2.5,
              py: 1,
              px: 1,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: isDisabled ? "not-allowed" : "pointer",
              bgcolor: isSelected ? "#fff" : "transparent",
              color: isDisabled ? "text.disabled" : isSelected ? "#5B6ED9" : "text.secondary",
              boxShadow: isSelected ? "0 1px 4px 0 rgba(15, 23, 42, 0.12)" : "none",
              transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {MODALITY_LABEL[option]}
            {isDisabled && <XCircle size={15} strokeWidth={2} />}
          </Box>
        );
      })}
    </Box>
  );
}
