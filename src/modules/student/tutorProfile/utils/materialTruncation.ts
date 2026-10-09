import type { TutorMaterialItem } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

const MAX_SUBJECTS_PREVIEW = 2;
const MAX_ITEMS_PER_SUBJECT_PREVIEW = 3;

export type GroupedMaterial = Record<string, TutorMaterialItem[]>;

export const groupBySubject = (material: TutorMaterialItem[]): GroupedMaterial => {
  return material.reduce<GroupedMaterial>((groups, item) => {
    if (!groups[item.subject]) {
      groups[item.subject] = [];
    }
    groups[item.subject].push(item);
    return groups;
  }, {});
};

interface MaterialPreview {
  /** Materias truncadas a MAX_SUBJECTS_PREVIEW, cada una con sus ítems
   * truncados a MAX_ITEMS_PER_SUBJECT_PREVIEW. Lista para renderizar
   * directo en la card resumen. */
  preview: GroupedMaterial;
  /** true si existen más materias de las que se muestran en preview.
   * Dispara el botón "Ver Todo" general, que abre el modal sin
   * materia preseleccionada (chip "Todos"). */
  hasMoreSubjects: boolean;
  /** Nombres de las materias visibles cuyo total de ítems excede
   * MAX_ITEMS_PER_SUBJECT_PREVIEW. Cada una dispara su propio
   * "Ver más" local, que abre el modal con esa materia preseleccionada.
   * Una materia puede estar acá aunque hasMoreSubjects sea false —
   * son señales independientes. */
  subjectsWithMoreItems: string[];
}

/**
 * Regla de truncamiento para la card resumen (no aplica al modal
 * "Ver Todo"/"Ver más", que siempre muestra todo sin límite dentro
 * de la materia filtrada):
 * - Máximo 2 materias visibles → exceso dispara "Ver Todo" general.
 * - Máximo 3 ítems por materia visible → exceso dispara un "Ver más"
 *   propio de esa materia, independiente de cuántas materias haya
 *   en total.
 * Ambas señales son independientes: una materia con 5 ítems tiene su
 * "Ver más" aunque solo haya 1 materia en total.
 */
export const buildMaterialPreview = (grouped: GroupedMaterial): MaterialPreview => {
  const subjectNames = Object.keys(grouped);

  const hasMoreSubjects = subjectNames.length > MAX_SUBJECTS_PREVIEW;
  const visibleSubjectNames = subjectNames.slice(0, MAX_SUBJECTS_PREVIEW);

  const subjectsWithMoreItems = visibleSubjectNames.filter(
    (subject) => grouped[subject].length > MAX_ITEMS_PER_SUBJECT_PREVIEW
  );

  const preview = visibleSubjectNames.reduce<GroupedMaterial>((acc, subject) => {
    acc[subject] = grouped[subject].slice(0, MAX_ITEMS_PER_SUBJECT_PREVIEW);
    return acc;
  }, {});

  return {
    preview,
    hasMoreSubjects,
    subjectsWithMoreItems,
  };
};