import { useState } from "react";
import { Button } from "@mui/material";
import AddSubjectModal from "./AddSubjectModal";
import { useFeedbackDialog } from "@/shared/hooks/useFeedbackDialog";
import { useAvailableSubjects } from "../../../../tutor/availability/hooks/useAvailableSubjects";

export default function AddSubjectButton() {
  const [openForm, setOpenForm] = useState(false);
  const { hasAvailableSubjects, isLoading } = useAvailableSubjects();
  const { openFeedbackDialog, feedbackDialog } = useFeedbackDialog();

  const handleClick = () => {
    if (isLoading) return;

    if (!hasAvailableSubjects) {
      openFeedbackDialog({
        title: "No se encuentran materias disponibles",
        description: "No se encuentran materias disponibles para agregar",
        variant: "warning",
      });
      return;
    }

    setOpenForm(true);
  };

  return (
    <>
      {feedbackDialog}

      <Button
        fullWidth
        variant="outlined"
        onClick={handleClick}
        sx={{
          borderStyle: "dashed",
          borderRadius: 2,
          py: 2,
          fontSize: 18,
        }}
      >
        + Agregar materia
      </Button>

      <AddSubjectModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          setOpenForm(false);
        }}
      />
    </>
  );
}