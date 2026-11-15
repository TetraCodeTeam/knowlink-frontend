# Mostrar la resolución del reclamo en el detalle de solicitudes (Frontend)

> Pasar este archivo completo a OpenCode (DeepSeek V4 Flash) parado en `TetraCodeTeam/knowlink-frontend`, rama `dev`. Leer antes `docs/base-standards.md`. Spec par: `claim-resolution-detail-backend.spec.md` (el backend debe estar desplegado primero).

## Problema

Cuando el admin resuelve un reclamo, el alumno y el tutor no ven el mensaje de resolución en el detalle de la solicitud. La notificación lo trae, pero se corta por el espacio disponible. El detalle debe mostrar la resolución completa.

## Contrato nuevo del backend

Los detalles de reclamo de alumno y tutor agregan `resolution` (nullable):

```ts
interface ClaimResolution {
  favoredParty: "TUTOR" | "STUDENT";
  inMyFavor: boolean;
  justification: string;
  resolvedAt: string; // ISO
}
```

`resolution` es `null` mientras el reclamo está `OPEN` o `IN_REVIEW`, y también en reclamos resueltos antes de que existiera el dato.

## Cambios

### 1. Tipos

- Crear `ClaimResolution` en `modules/support/interfaces/responses/claim-resolution.response.ts`, y reutilizarlo desde los dos módulos.
- `modules/student/support/interfaces/responses/student-claim-detail.response.ts`: agregar `resolution: ClaimResolution | null` a `StudentSessionClaimDetail`.
- `modules/support/interfaces/responses/tutor-claim-detail.response.ts`: agregar `resolution: ClaimResolution | null` a `TutorClaimDetail`.
- Revisar `modules/support/utils/supportMappers.utils.ts` y los hooks/api de `support` y `student/support`: si el detalle pasa por un mapper, propagar `resolution`; si se devuelve el DTO tal cual, no hace falta nada más.

### 2. Componente compartido `ClaimResolutionSection`

Crear `modules/support/components/support-detail/ClaimResolutionSection.tsx`, reutilizando `SupportDetailSection`, `detailCardSx` y los estilos de `supportText.styles` (no estilos nuevos salvo que haga falta):

- Props: `{ resolution: ClaimResolution }`.
- Título de sección: **"Resolución del reclamo"**.
- Línea de resultado según `inMyFavor`: "La resolución fue a tu favor." / "La resolución no fue a tu favor." (color acento / neutro; evitar rojo alarmante).
- Línea secundaria: "Resuelto el {fecha}" usando el formateador de fecha ya existente en `support/utils/format.utils.ts` (`new Date(...).toLocaleString("es-AR")` como en "Seguimiento" si no hay uno).
- Bloque **"Justificación del equipo académico:"** (`supportStrongLabelSx`) y debajo el texto con `supportQuoteTextSx`.
- El texto de la justificación debe verse **completo, sin truncar**: `whiteSpace: "pre-wrap"` y `wordBreak: "break-word"` (admite hasta 1000 caracteres).

### 3. Integración

- `ClaimDetailContent.tsx` (tutor) y `StudentClaimDetailContent.tsx` (alumno): renderizar `<ClaimResolutionSection resolution={claim.resolution} />` **solo si `claim.resolution` no es null**, ubicado **antes** de "Fase actual del reclamo" (es lo más importante cuando el caso está cerrado).
- Cuando el reclamo está resuelto, ocultar o reemplazar el texto "Los fondos se liberarán automáticamente al finalizar la revisión." de "Fondos y garantía" para que no contradiga el estado resuelto (condicionar por `claim.status === "RESOLVED"`; mostrar "Fondos liberados al {tutor|alumno}" solo si ya está disponible en `funds`, si no, simplemente omitir la nota).

### 4. Notificación

- No cambia el componente `NotificationItem`. El backend pasa a enviar un mensaje corto que invita a abrir el detalle; la acción "Ver" ya navega a `/student/complaints?tab=claims&claim=<id>` o `/tutor/requests?tab=claims&claim=<id>` (`SESSION_CLAIM_UPDATE`).
- Verificar manualmente que al entrar por la notificación el detalle del reclamo se abre seleccionado y muestra la resolución. El `referenceId` de la notificación es el id de la **disputa** (reclamo representativo), que puede no ser el reclamo propio del usuario: confirmar que `useSupportSelection` / el detalle lo resuelve bien para ambas partes; si no, anotarlo como hallazgo en lugar de cambiar el backend en este spec.

## Criterios de aceptación

```gherkin
Scenario: El alumno ve la resolución
  Given un reclamo RESOLVED con justificación de 800 caracteres
  When el alumno abre el detalle desde "Mis solicitudes"
  Then ve la sección "Resolución del reclamo" con el resultado, la fecha y la justificación completa

Scenario: El tutor ve la resolución
  Given el mismo reclamo
  When el tutor abre el detalle desde "Solicitudes"
  Then ve la misma sección con "inMyFavor" desde su punto de vista

Scenario: Reclamo en curso
  Given un reclamo OPEN o IN_REVIEW
  Then la sección de resolución no se renderiza

Scenario: Entrada desde la notificación
  Given una notificación "Reclamo resuelto"
  When el usuario toca "Ver"
  Then se abre el detalle del reclamo con la resolución visible
```

## Tests

- Test de `ClaimResolutionSection` (Vitest + Testing Library, según lo que use el repo): render a favor / en contra, justificación larga completa, fecha.
- Tests de `ClaimDetailContent` y `StudentClaimDetailContent`: con `resolution` muestran la sección; con `null` no; el texto de fondos no contradice el estado `RESOLVED`.
- Actualizar mocks/fixtures de detalle (`resolution: null` por defecto).
- Correr lint, typecheck y tests del repo; sin `any`, Prettier (doble comilla, `;`, printWidth 100).

## Fuera de alcance

- Cambios en el panel admin (`modules/admin/session-claims`).
- Rediseño de `NotificationItem`.
- Reclamos de materiales.
