import { useState } from "react";
import { IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = Omit<TextFieldProps, "type">;

export default function PasswordField(props: PasswordFieldProps) {
  const { InputProps, ...rest } = props;
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...rest}
      type={visible ? "text" : "password"}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            {InputProps?.endAdornment}
            <IconButton
              onClick={() => setVisible((prev) => !prev)}
              edge="end"
              size="small"
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}