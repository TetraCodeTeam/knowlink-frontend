import { useSessionConfirmationStore } from "@/modules/tutor/attendance/hooks/useSessionConfirmationStore";
import { Box, Button } from "@mui/material";
import { SessionConfirmationWidget } from "@/modules/tutor/attendance/components/Sessionconfirmationwidget";

export default function TutorHomePage() {
  const openConfirmation = useSessionConfirmationStore((state) => state.openConfirmation);

  return (
    <>
      <Box sx={{ minHeight: "100vh" }} />

      <Button
        onClick={() =>
          openConfirmation({
            sessionId: "test-session-123",
            deadlineLabel: "23:00 hs",
          })
        }
      >
        Abrir confirmación de prueba
      </Button>

      <SessionConfirmationWidget
        onConfirm={async ({ sessionId, code }) => {
          console.log({ sessionId, code });
        }}
      />
    </>
  );
}