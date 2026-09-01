import { BookSearch, NotebookPen } from "lucide-react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { Role } from "@/shared/types/role.type";

const ROLE_CONTENT: Record<Role, { icon: typeof NotebookPen; label: string; description: string }> = {
  TUTOR: { icon: NotebookPen, label: "Tutor", description: "Ofrecer clases" },
  STUDENT: { icon: BookSearch, label: "Alumno", description: "Busco tutores para estudiar" },
};

interface RoleToggleGroupProps {
  value: Role | undefined;
  onChange: (value: Role) => void;
  showDescription?: boolean;
}

export default function RoleToggleGroup({
  value,
  onChange,
  showDescription = true,
}: RoleToggleGroupProps) {
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      value={value}
      onChange={(_, newValue) => newValue && onChange(newValue)}
      sx={{ gap: 1.5 }}
    >
      {(Object.entries(ROLE_CONTENT) as [Role, (typeof ROLE_CONTENT)[Role]][]).map(
        ([role, { icon: Icon, label, description }]) => (
          <ToggleButton
            key={role}
            value={role}
            sx={{
              flexDirection: "column",
              gap: 0.5,
              py: 2,
              border: "1px solid #e2e8f0 !important",
              borderRadius: "10px !important",
              "&.Mui-selected": {
                bgcolor: "#eef2ff",
                borderColor: "#5B6ED9 !important",
              },
            }}
          >
            <Icon size={20} />
            <Typography fontWeight={700} fontSize={15}>
              {label}
            </Typography>
            {showDescription && (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
          </ToggleButton>
        ),
      )}
    </ToggleButtonGroup>
  );
}
