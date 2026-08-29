import { useState } from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { BookOpenText } from "lucide-react";
import type { TutorSubjectRate } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import { SubjectRateItem } from "@/modules/student/tutorProfile/components/SubjectItem";
import { SubjectsDialog } from "@/modules/student/tutorProfile/components/SubjectsDialog";

interface TutorSubjectsCardProps {
  subjectRates: TutorSubjectRate[];
}

export const TutorSubjectsCard = ({ subjectRates }: TutorSubjectsCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const previewSubjects = subjectRates.slice(0, 3);
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BookOpenText size={25} color="#5865C8" />
            <Typography variant="h5" fontWeight={500}>
              Materias y Tarifas
            </Typography>
          </Stack>
          {subjectRates.length > 3 && (
            <Button size="medium" onClick={() => setDialogOpen(true)}>
              Ver Todas
            </Button>
          )}
        </Stack>

        <Stack spacing={2}>
          {previewSubjects.map((subject) => (
            <SubjectRateItem key={subject.id} subject={subject} />
          ))}
        </Stack>
      </CardContent>

      <SubjectsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} subjectRates={subjectRates} />
    </Card>
  );
};