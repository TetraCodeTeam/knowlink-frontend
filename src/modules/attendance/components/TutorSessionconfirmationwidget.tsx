import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Box, Button, Paper, Typography } from "@mui/material";

import { useDraggablePosition } from "@/modules/attendance/hooks/useDraggablePosition";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import CountdownTimer from "@/shared/components/CountdownTimer";
import {
  SessionCodeInput,
  type SessionCodeInputHandle,
} from "@/modules/attendance/components/TokenInput";

interface SessionConfirmationWidgetProps {
  /** Ya resuelto contra el backend (verificar código, marcar sesión
   * como confirmada, etc.). Si el código es inválido o falla la red,
   * debe RECHAZAR la promesa (throw / Promise.reject) — el widget
   * usa eso para mostrar el error y limpiar los casilleros. */
  onConfirm: (params: { sessionId: string; code: string }) => void | Promise<void>;
}

const DEFAULT_ERROR_MESSAGE =
  "El código ingresado no es válido. Verificalo con tu alumno e intentá de nuevo.";

/**
 * Se monta UNA sola vez en el layout raíz de la app (fuera del
 * router), no por pantalla. Se muestra/oculta según `pending` del store global, así
 * que persiste visualmente aunque el usuario navegue entre rutas.
 */
export const SessionConfirmationWidget = ({ onConfirm }: SessionConfirmationWidgetProps) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<SessionCodeInputHandle>(null);
  const pending = useSessionConfirmationStore((state) => state.pending);
  const clearConfirmation = useSessionConfirmationStore((state) => state.clearConfirmation);

  const { position, isDragging, handleMouseDragStart, handleTouchDragStart } =
    useDraggablePosition(paperRef);

  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!pending) return null;

  const handleCodeComplete = async () => {
    setIsConfirming(true);
    setErrorMessage(null);

    try {
      await onConfirm({ sessionId: pending.sessionId, code: enteredCode });
      clearConfirmation();
    } catch (error) {
      const message = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
      setErrorMessage(message || DEFAULT_ERROR_MESSAGE);
      setEnteredCode("");
      setIsCodeComplete(false);
      codeInputRef.current?.reset();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Paper
      ref={paperRef}
      elevation={8}
      sx={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 1300,
        width: 340,
        borderRadius: 4,
        p: 3,
        textAlign: "center",
        cursor: isDragging ? "grabbing" : "default",
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <Box
        onMouseDown={handleMouseDragStart}
        onTouchStart={handleTouchDragStart}
        sx={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "#EDEBFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <RotateCcw size={26} color="#5865C8" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Ingresá tu token
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Pídele al alumno el código de 4 dígitos para confirmar la clase
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <SessionCodeInput
          ref={codeInputRef}
          onComplete={(code) => {
            setEnteredCode(code);
            setIsCodeComplete(true);
          }}
          disabled={isConfirming}
        />
      </Box>

      {errorMessage && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1.5,
            color: "#B3261E",
          }}
        >
          {errorMessage}
        </Typography>
      )}

      <Box sx={{ mt: 3, mb: 3} }>
        <CountdownTimer
          expiresAt={pending.expiresAt}
          label="Tiempo para confirmar"
          onExpire={clearConfirmation}
          backgroundColor="#EEEDFE"
          borderColor="#909dff62"
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        disabled={!isCodeComplete || isConfirming}
        onClick={() => void handleCodeComplete()}
        sx={{ textTransform: "none", borderRadius: 2, py: 1, }}
      >
        {isConfirming ? "Confirmando..." : "Confirmar"}
      </Button>
    </Paper>
  );
};
