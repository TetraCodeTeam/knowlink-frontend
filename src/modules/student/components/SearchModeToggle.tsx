import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export type SearchMode = "materias" | "tutores";

interface SearchModeToggleProps {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export default function SearchModeToggle({ value, onChange }: SearchModeToggleProps) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, next: SearchMode | null) => {
        if (next) onChange(next);
      }}
      sx={{
        backgroundColor: "#EDEBFA",
        borderRadius: "999px",
        p: 0.5,
        "& .MuiToggleButton-root": {
          border: "none",
          borderRadius: "999px !important",
          textTransform: "none",
          px: 2,
          gap: 0.5,
          "&.Mui-selected": {
            backgroundColor: "#5865C8",
            color: "#fff",
            "&:hover": { backgroundColor: "#4a54ad" },
          },
        },
      }}
    >
      <ToggleButton value="materias" aria-label="Ver materias">
        <MenuBookOutlinedIcon fontSize="small" /> Materias
      </ToggleButton>
      <ToggleButton value="tutores" aria-label="Ver tutores">
        <PersonOutlineIcon fontSize="small" /> Tutores
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
