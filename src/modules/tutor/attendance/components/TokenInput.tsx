import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { Box, TextField } from "@mui/material";

interface SessionCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export interface SessionCodeInputHandle {
  /** Limpia todos los casilleros y devuelve el foco al primero.
   * Pensado para que el padre lo llame tras un intento fallido. */
  reset: () => void;
}

/**
 * Input de código numérico dividido en casilleros individuales.
 * Comportamiento esperado (estándar en este tipo de componente, ej.
 * verificación de 2FA):
 * - Escribir un dígito avanza automáticamente al siguiente casillero.
 * - Backspace en un casillero vacío retrocede al anterior y lo borra.
 * - Pegar un código completo (ej. copiado de un SMS) lo distribuye
 *   en todos los casilleros de una.
 * - onComplete se dispara solo cuando los `length` casilleros tienen
 *   contenido, con el código concatenado — el padre decide qué hacer
 *   (habilitar el botón Confirmar, o confirmar automáticamente).
 *
 * Expone un handle imperativo (`reset`) porque el padre necesita
 * poder limpiar el código tras un intento fallido — algo que no
 * encaja bien como prop controlada sin duplicar todo el estado de
 * casilleros afuera.
 */
export const SessionCodeInput = forwardRef<SessionCodeInputHandle, SessionCodeInputProps>(
  ({ length = 4, onComplete, disabled = false }, ref) => {
    const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setDigits(Array(length).fill(""));
        inputRefs.current[0]?.focus();
      },
    }));

    const emitIfComplete = (next: string[]) => {
      const code = next.join("");
      if (code.length === length && next.every((d) => d !== "")) {
        onComplete(code);
      }
    };

    const handleChange = (index: number, rawValue: string) => {
      const value = rawValue.replace(/[^0-9]/g, "").slice(-1);

      setDigits((prev) => {
        const next = [...prev];
        next[index] = value;
        emitIfComplete(next);
        return next;
      });

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      const pasted = event.clipboardData.getData("text").replace(/[^0-9]/g, "");
      if (!pasted) return;

      event.preventDefault();
      const next = Array(length)
        .fill("")
        .map((_, i) => pasted[i] ?? "");
      setDigits(next);
      emitIfComplete(next);

      const lastFilledIndex = Math.min(pasted.length, length) - 1;
      inputRefs.current[Math.max(lastFilledIndex, 0)]?.focus();
    };

    return (
      <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
        {digits.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                maxLength: 1,
                "aria-label": `Dígito ${index + 1} de ${length}`,
                sx: { textAlign: "center", fontSize: "1.5rem", fontWeight: 600, p: 1.25 },
              },
            }}
            sx={{ width: 52, borderRadius: 10 }}
          />
        ))}
      </Box>
    );
  }
);

SessionCodeInput.displayName = "SessionCodeInput";
