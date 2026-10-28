import { Box, Typography } from "@mui/material";

interface RegistrationStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function RegistrationStepper({ currentStep, totalSteps }: RegistrationStepperProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isLast = step === totalSteps;

        return (
          <Box key={step} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Círculo numerado */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isActive || isCompleted ? "#4361ee" : "#e0e4f8",
                transition: "background-color 0.2s",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: isActive || isCompleted ? "#fff" : "#9aa3d4" }}
              >
                {step}
              </Typography>
            </Box>

            {/* Línea conectora (excepto después del último paso) */}
            {!isLast && (
              <Box
                sx={{
                  width: 2,
                  height: 56,
                  bgcolor: isCompleted ? "#4361ee" : "#e0e4f8",
                  transition: "background-color 0.2s",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}