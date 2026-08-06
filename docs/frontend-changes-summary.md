# Resumen de cambios realizados (alineación con base-standards)

## Nota importante sobre mensajes de error
Se respetó tu criterio: **no** usar el texto literal de ejemplo de la guía como mensaje fijo.
En los puntos de fallback se dejó un mensaje genérico corto (por ejemplo, "Ocurrió un error inesperado").

## Resumen general
Se aplicó una normalización fuerte de naming y referencias para alinear el frontend con los estándares del proyecto, con foco principal en:

1. Convención de nombres de archivos no-componente en kebab-case.
2. Actualización de imports tras los renombres.
3. Ajustes de lint/types para mantener compilación y reglas limpias.
4. Ajustes puntuales de manejo de errores y estilos.

## Qué cambió por áreas y archivos

### 1) Renombre de archivos (kebab-case) y referencias
Se renombraron archivos no-componente en múltiples módulos. Esto afectó especialmente hooks, styles, constants, utils y algunos archivos de api/shared.

Archivos representativos involucrados:
- src/modules/auth/hooks/useAuthStore.ts -> src/modules/auth/hooks/use-auth-store.ts
- src/modules/auth/hooks/useLogin.ts -> src/modules/auth/hooks/use-login.ts
- src/modules/tutor/hooks/useTutorProfile.ts -> src/modules/tutor/hooks/use-tutor-profile.ts
- src/modules/tutor/availability/hooks/useAvailabilityDraft.ts -> src/modules/tutor/availability/hooks/use-availability-draft.ts
- src/modules/tutor/availability/styles/availabilityCalendarSx.ts -> src/modules/tutor/availability/styles/availability-calendar-sx.ts
- src/shared/lib/httpClient.ts -> src/shared/lib/http-client.ts
- src/shared/styles/buttonSx.ts -> src/shared/styles/button-sx.ts

Además, se tocaron muchos archivos consumidores para actualizar imports y evitar referencias rotas.

### 2) Módulo Auth
Archivos modificados:
- src/modules/auth/api/auth.api.ts
- src/modules/auth/components/LoginForm.tsx
- src/modules/auth/components/RegisterForm.tsx
- src/modules/auth/components/student-register/StudentAccountForm.tsx
- src/modules/auth/components/tutor-register/TutorRegisterWizard.tsx
- src/modules/auth/components/tutor-register/steps/Step1Account.tsx
- src/modules/auth/components/tutor-register/steps/Step2AcademicProfile.tsx
- src/modules/auth/components/tutor-register/steps/Step4Confirmation.tsx
- src/modules/auth/pages/ActivateAccountPage.tsx
- src/modules/auth/pages/CheckEmailPage.tsx
- src/modules/auth/pages/LoginPage.tsx
- src/modules/auth/pages/StudentRegisterPage.tsx
- src/modules/auth/pages/TutorRegisterPage.tsx

Qué cambió (alto nivel):
- Ajustes de imports por renombre de hooks.
- Alineación de formularios/flujo de registro con nuevas rutas de archivos.
- Ajustes de lint (tipado/eventos/texto JSX) en pasos del registro.
- En LoginPage y estilos asociados, se consolidó estilo sin inline innecesario.

### 3) Módulo Student
Archivos modificados:
- src/modules/student/components/StudentSidebar.tsx
- src/modules/student/pages/ViewTutorProfile.tsx

Qué cambió:
- Actualización de imports por renombre de hooks.
- Ajustes de tipado/lint en sidebar y referencias relacionadas.

### 4) Módulo Tutor (core)
Archivos modificados:
- src/modules/tutor/api/getTutorProfile.ts (renombrado a get-tutor-profile.ts)
- src/modules/tutor/components/ReviewItem.tsx
- src/modules/tutor/components/ReviewsDialog.tsx
- src/modules/tutor/components/SubjectItem.tsx
- src/modules/tutor/components/TutorReviewsCard.tsx
- src/modules/tutor/components/TutorSidebar.tsx

Qué cambió:
- Actualización de imports por renombres en hooks/api.
- Ajustes de lint y compatibilidad en componentes.

### 5) Tutor Availability
Archivos modificados:
- src/modules/tutor/availability/api/availability-blocks.api.ts
- src/modules/tutor/availability/api/tutor-notice.api.ts
- src/modules/tutor/availability/components/AvailabilityEditor.tsx
- src/modules/tutor/availability/components/AvailabilityInfoNote.tsx
- src/modules/tutor/availability/components/AvailabilityLegend.tsx
- src/modules/tutor/availability/components/MinNoticeHoursPanel.tsx
- src/modules/tutor/availability/hooks/useMinNoticeDraft.ts (renombrado a use-min-notice-draft.ts)
- src/modules/tutor/availability/utils/minNotice.utils.ts (renombrado a min-notice.utils.ts)
- y otros hooks/constants/styles renombrados de la misma carpeta

Qué cambió:
- Renombre de hooks/constants/styles a kebab-case.
- Ajuste de imports y referencias en componentes de disponibilidad.
- Ajustes de lint/typing en handlers y textos JSX.

### 6) Tutor Profile
Archivos modificados:
- src/modules/tutor/profile/components/ModalityChip.tsx
- src/modules/tutor/profile/components/PaymentSection.tsx
- src/modules/tutor/profile/components/SubjectCard.tsx
- src/modules/tutor/profile/components/TutorProfilePage.tsx
- src/modules/tutor/profile/api/getMyTutorProfile.ts (renombrado a get-my-tutor-profile.ts)
- src/modules/tutor/profile/constants/profileColors.constants.ts (renombrado a profile-colors.constants.ts)
- src/modules/tutor/profile/hooks/useMyTutorProfile.ts (renombrado a use-my-tutor-profile.ts)
- src/modules/tutor/profile/styles/profileStyles.ts (renombrado a profile-styles.ts)

Qué cambió:
- Renombres a kebab-case + actualización de imports.
- Ajustes de integración y lint por cambio de rutas.

### 7) Módulos Tutors y Users
Archivos modificados:
- src/modules/tutors/api/catalog.api.ts
- src/modules/users/api/users.api.ts
- hooks de tutors renombrados a kebab-case

Qué cambió:
- Actualización de imports hacia shared y hooks renombrados.

### 8) Providers, routes y shared
Archivos modificados:
- src/providers/AppProvider.tsx
- src/providers/RoutesProvider.tsx
- src/routes/ProtectedRoute.tsx
- src/shared/components/AppButton.tsx
- src/shared/lib/httpClient.ts (renombrado a http-client.ts)
- src/shared/hooks/useSnackbarStore.ts (renombrado a use-snackbar-store.ts)
- src/shared/styles/buttonSx.ts (renombrado a button-sx.ts)
- src/styles.css

Qué cambió:
- Ajuste de imports globales tras renombre de shared.
- Correcciones de reglas de hooks/lint en routing.
- Ajustes puntuales de estilos y uso de componentes compartidos.

## Validación técnica del estado
Durante el proceso se ejecutaron validaciones de tipo y lint para estabilizar el código tras los cambios de naming/imports.

---

## Sección: archivos nuevos agregados (excluyendo renombres)
**Resultado:** no hay archivos realmente nuevos.

Todos los archivos marcados como "added" en git corresponden a reemplazos por renombre de archivos existentes (principalmente migración a kebab-case), no a creación de nuevas features o nuevos módulos.




Sí. En tu código de proyecto (sin contar node_modules) hay duplicados de nombre de archivo:

availability-block.interface.ts (2 archivos)

src/modules/tutor/availability/interfaces/requests/availability-block.interface.ts

src/modules/tutor/availability/interfaces/responses/availability-block.interface.ts

constants.ts (3 archivos)

src/modules/auth/constants.ts

src/modules/users/constants.ts

src/shared/lib/constants.ts
