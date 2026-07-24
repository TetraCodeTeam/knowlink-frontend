import { useState } from "react";
import { Button } from "@mui/material";
import AddSubjectModal from "./AddSubjectModal";

export default function AddSubjectButton() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => setOpenForm(true)}
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