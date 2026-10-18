import { useState } from "react";
import { Box, Typography } from "@mui/material";
import InstitutionSelect from "@/modules/catalog/components/InstitutionSelect";
import CareersList from "@/modules/catalog/components/CareersList";
import SubjectCreateForm from "@/modules/catalog/components/SubjectCreateForm";
import SubjectsList from "@/modules/catalog/components/SubjectsList";

export default function AdminCatalogoPage() {
  const [institutionId, setInstitutionId] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 720, width: "100%" }}>
      <Box>
        <Typography variant="h5" component="h1" fontWeight={700}>
          Administración de catálogo
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Gestioná las carreras y materias de cada institución.
        </Typography>
      </Box>

      <InstitutionSelect value={institutionId} onChange={setInstitutionId} />

      {!institutionId ? (
        <Typography variant="body2" color="text.secondary">
          Seleccioná una institución para ver y editar su catálogo.
        </Typography>
      ) : (
        <>
          <CareersList institutionId={institutionId} />
          <SubjectCreateForm institutionId={institutionId} />
          <SubjectsList institutionId={institutionId} />
        </>
      )}
    </Box>
  );
}