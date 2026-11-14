import type { SxProps, Theme } from "@mui/material";
import { TextField, type TextFieldProps } from "@mui/material";

// Sin flechitas: sumaban o restaban por pasos que no sirven para un precio (de a 0,01 o de a 1).
const hideSpinnersSx: SxProps<Theme> = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    { WebkitAppearance: "none", margin: 0 },
};

/**
 * Campo de precio por hora compartido por el registro de tutor y los formularios de materia.
 * Es un campo numérico que se escribe a mano: sin flechitas y sin que la rueda del mouse cambie
 * el valor. Acepta centavos (la validación de cada formulario fija el máximo de decimales).
 *
 * Se configura igual que un `TextField`; lo propio del input (`min`, `aria-label`) va en
 * `slotProps.htmlInput`.
 */
export default function PriceField({ sx, slotProps, ...props }: TextFieldProps) {
  const htmlInput = (slotProps?.htmlInput ?? {}) as Record<string, unknown>;

  return (
    <TextField
      type="number"
      {...props}
      slotProps={{
        ...slotProps,
        htmlInput: {
          min: 0,
          step: "any",
          inputMode: "decimal",
          // Con el campo enfocado, la rueda cambia el número sin que nadie lo note.
          onWheel: (event: { currentTarget: HTMLInputElement }) => event.currentTarget.blur(),
          ...htmlInput,
        },
      }}
      sx={[hideSpinnersSx, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>}
    />
  );
}
