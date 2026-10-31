# Admin 04 — Reclamos de sesiones (Frontend)

## Metadatos

| Campo | Valor |
|---|---|
| Módulo frontend | `admin/session-claims` — nuevo |
| Rol | ADMIN |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` / `dev` |
| Ruta | `/admin/session-claims` (deep link opcional: `?selected=<claimId>`) |
| Historias relacionadas | US-51 (realizar reclamo de sesión, lado alumno/tutor), US-15 (liberación/devolución de fondos), US-41 (confirmación de sesión) |
| Diseño fuente | Figma `KnowLink (Copy)`: `Reclamo de sesiones` `1252:2858` (sin selección), `…, detalle antes de tomar reclamo` `1250:2648`, `…, detalle cuando se asigna el reclamo a sí mismo` `1252:3017`, `…, mensaje al hacer click en consultar datos personales` `1253:3197`, `…, mensaje de confirmación de resolución` `1254:3380`, `… (cuando no hay)` `1270:5019` |
| Depende de | Admin 01 (shell) |
| Backend requerido | **No existe en `main`** (ver "Contrato propuesto") |

---

## Estado actual verificado

- Lado alumno/tutor: `src/modules/claim/` y `src/modules/support/` (`ClaimsTab`, `ClaimListItem`, `ClaimDetailContent`, `claim-status.type.ts`). `ClaimStatus = "OPEN" | "IN_REVIEW" | "RESOLVED"` coincide con los tres estados del diseño (Pendiente / En revisión / Resuelto) y se **reutiliza el mismo vocabulario** en el admin.
- Texto ya mostrado al usuario en `support` (`ClaimsSidebar`): los fondos se liberan automáticamente cuando el administrador resuelve el caso. La resolución del admin es lo que dispara ese comportamiento.
- Backend (`main`): solo existe `POST /api/v1/admin/bookings/{bookingId}/funds/retry` (`AdminFundsControllerImpl`), que **reintenta** la resolución de fondos tras una disputa. No hay endpoints de listado, asignación, contacto ni resolución de reclamos.
- Reglas de negocio ya acordadas para US-51 (reclamo dentro de 24 h de una sesión terminada y no confirmada con token; un reclamo activo por sesión; con reclamo activo no se confirma la clase con token). El admin **no** las re-implementa; solo las consume.

---

## Pantalla (layout master–detail)

Cabecera: título "Reclamos de sesiones" + subtítulo "Gestiona, audita y media disputas entre tutores y alumnos por sesiones no dictadas, desconexiones o desacuerdos de servicio."

**Filtros**: pestañas **Todo · Pendiente [5] · En revisión · Resuelto**; botón-ícono de calendario/reloj (sin función definida); toggle **Todas | Asignadas a mí**. Igual que Admin 03 (extraer componentes compartidos, ver abajo).

**Columna izquierda — lista.** Una fila por reclamo:
- Franja de color por estado: Pendiente = ámbar, En revisión = índigo, Resuelto = verde.
- Materia (700) + chip de estado.
- Línea de partes: "Silvina Rubio (Tutora) • Bruno Peralta (Alumno)".
- Línea de sesión: reloj + "Sesión del 22 julio". En revisión agrega "Asignado a: Moderador Carlos V.".
- Acción: **Revisar** (relleno índigo si Pendiente, outline en los demás).
- Reclamos Resueltos muestran "Justificación del administrador: …".
- Pie "Mostrando 1–4 de 14 …" + paginación.

**Columna derecha — panel "Detalle del reclamo"** (tarjeta blanca ≈ 340 px). Estados:

| Estado | Contenido |
|---|---|
| **Sin selección** | "Seleccioná un reclamo" / "Elegí un reclamo de la lista para ver los mensajes de ambas partes y resolverlo." + bloque **ANTES DE RESOLVER** con 3 pautas (abajo) |
| **Sin tomar** (`1250:2648`) | Filas: Materia solicitada · Sesión (fecha) · Monto retenido (`$ 8000`); mensaje del tutor y del alumno; botón **Tomar solicitud** + nota "Al tomar la solicitud, el reclamo pasará a estar **En revisión** y quedará asignado a tu moderación." |
| **Tomado por mí** (`1252:3017`) | Mismos datos + botón outline **Consultar datos de contacto**, selector **Resolver a favor de: [Alumno] [Tutor]**, textarea "Justificación (obligatoria, visible para ambas partes)" y botón primario **Confirmar resolución** |
| **Resuelto** | Detalle en solo lectura con la justificación del administrador |

**Mensajes de las partes**: bloque con el rol y nombre ("Silvina Rubio (Tutora)") y una burbuja con el motivo/comentario ("Esperé conectado 20 minutos y el alumno nunca ingresó a la videollamada."). Si una parte no dejó mensaje: ícono tachado + "No se registró un mensaje".

**Pautas "ANTES DE RESOLVER"**
1. Leé el mensaje de ambas partes antes de decidir. Si falta contexto, podés citarlas para conversar.
2. Los fondos de la sesión permanecen retenidos hasta que confirmes una resolución.
3. La justificación que escribas es obligatoria y la van a ver ambas partes, así que evitá juicios de valor.

**Diálogo "Datos de contacto"** (`1253:3197`): título "Datos de contacto" + "Uso confidencial para mediación"; texto "Información registrada de las partes involucradas para resolver discrepancias de la sesión." Una tarjeta por parte con iniciales en avatar, nombre, rol, **Teléfono**, **Email**, y **Institución / Legajo** (tutor) o **Identificación / DNI** (alumno). Botón **Cerrar**.

**Diálogo de confirmación** (`1254:3380`): "¿Confirmar esta resolución?" — "Se transferirán los fondos retenidos según lo indicado y se notificará a ambas partes junto con tu justificación. Esta decisión no puede modificarse después."

**Estado vacío**: "No hay reclamos para mostrar. Probá con otro estado o esperá a que se inicie un nuevo reclamo."

---

## Contrato de datos (PROPUESTO — confirmar con backend, no existe en `main`)

Todos con `@PreAuthorize("hasRole('ADMIN')")`.

| Acción | Endpoint propuesto |
|---|---|
| Listar | `GET /api/v1/admin/session-claims?status=&assignedToMe=&page=&size=` |
| Detalle | `GET /api/v1/admin/session-claims/{claimId}` |
| Tomar solicitud | `POST /api/v1/admin/session-claims/{claimId}/assign` (409 si ya fue tomado) |
| Datos de contacto | `GET /api/v1/admin/session-claims/{claimId}/contact-info` (el backend debe **auditar** cada consulta) |
| Resolver | `POST /api/v1/admin/session-claims/{claimId}/resolve` body `{ favoredParty, justification }` |

```ts
// ClaimStatus ya existe en modules/support/interfaces/claim-status.type.ts ("OPEN" | "IN_REVIEW" | "RESOLVED").
// Si se reutiliza desde ahí, importar el tipo; si no, moverlo a shared/types/ (regla de enums de base-standards).
export type ClaimFavoredParty = "STUDENT" | "TUTOR"; // modules/admin/types/claim-favored-party.type.ts

export interface AdminClaimParty {
  fullName: string;
  role: "TUTOR" | "STUDENT";
  message: string | null;      // null => "No se registró un mensaje"
}

export interface AdminSessionClaimListItem {
  claimId: string;
  subjectName: string;
  status: ClaimStatus;
  sessionDate: string;          // ISO
  tutorName: string;
  studentName: string;
  assignedToName: string | null;
  assignedToMe: boolean;
  resolutionJustification: string | null;
}

export interface AdminSessionClaimListResponse {
  content: AdminSessionClaimListItem[];
  page: number;
  size: number;
  totalElements: number;
  statusCounts: { open: number; inReview: number; resolved: number };
}

export interface AdminSessionClaimDetailResponse extends AdminSessionClaimListItem {
  heldAmount: number;           // monto retenido
  tutor: AdminClaimParty;
  student: AdminClaimParty;
}

export interface ResolveSessionClaimRequest {
  favoredParty: ClaimFavoredParty;
  justification: string;
}

export interface AdminClaimContactInfoResponse {
  tutor: { fullName: string; phone: string; email: string; institution: string; fileNumber: string };
  student: { fullName: string; phone: string; email: string; nationalId: string };
}
```

Regla de `docs/base-standards.md`: los tipos siguen al DTO real del backend.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Resolución de reclamos de sesión por el administrador

  Scenario: Ver listado
    Given reclamos de sesiones registrados
    When el ADMIN abre "/admin/session-claims"
    Then ve una fila por reclamo con materia, estado, tutor, alumno y fecha de sesión
    And el panel derecho muestra "Seleccioná un reclamo" con las pautas "Antes de resolver"

  Scenario: Filtrar por estado y por asignación
    When selecciona "Pendiente"
    Then solo ve reclamos pendientes y la pestaña muestra su conteo
    When activa "Asignadas a mí"
    Then solo ve los asignados a su cuenta

  Scenario: Abrir un reclamo sin tomar
    Given un reclamo Pendiente
    When hace clic en "Revisar"
    Then la fila queda resaltada
    And el panel muestra materia, fecha de sesión, monto retenido y el mensaje de cada parte
    And ofrece "Tomar solicitud"
    And NO muestra el formulario de resolución

  Scenario: Parte sin mensaje
    Given que el alumno no dejó mensaje
    Then el panel muestra "No se registró un mensaje" para esa parte

  Scenario: Tomar solicitud
    When hace clic en "Tomar solicitud"
    Then el reclamo pasa a "En revisión" asignado al admin
    And el panel muestra "Consultar datos de contacto", "Resolver a favor de", "Justificación" y "Confirmar resolución"

  Scenario: Otro admin lo tomó primero
    Given que el backend responde 409 al asignar
    Then se muestra el mensaje del backend y el panel se refresca con el estado real

  Scenario: Consultar datos de contacto
    Given un reclamo En revisión asignado a mí
    When hace clic en "Consultar datos de contacto"
    Then se abre el diálogo con teléfono, email e identificación de ambas partes
    And se cierra con "Cerrar"
    And los datos no quedan guardados al cerrar el diálogo

  Scenario: Resolver sin elegir parte
    When intenta confirmar sin seleccionar "Alumno" o "Tutor"
    Then no puede continuar y se indica "Elegí a favor de quién resolver"

  Scenario: Resolver sin justificación
    When intenta confirmar con la justificación vacía
    Then se muestra "La justificación es obligatoria"
    And no se abre el diálogo de confirmación

  Scenario: Confirmar resolución
    Given parte elegida y justificación completa
    When hace clic en "Confirmar resolución"
    Then se abre "¿Confirmar esta resolución?" con la advertencia de que no puede modificarse
    When confirma
    Then el reclamo pasa a "Resuelto" con la justificación
    And la lista, el detalle y el conteo de pendientes se actualizan
    And se muestra un toast de éxito

  Scenario: Reclamo resuelto
    Given un reclamo Resuelto
    When lo abre
    Then ve el detalle en solo lectura con la justificación del administrador
    And no hay controles de resolución

  Scenario: Error al resolver
    Given que el backend devuelve un error
    Then se muestra su "message" en un toast
    And el diálogo se cierra sin perder la parte elegida ni la justificación escritas

  Scenario: Sin resultados
    Then la lista muestra "No hay reclamos para mostrar."
```

---

## Estructura de archivos

```
src/modules/admin/
├── types/claim-favored-party.type.ts
├── constants/admin-query-keys.ts            # sessionClaims.list(filters), .detail(id)  (mismo archivo que Admin 02/03)
├── components/                              # compartidos entre Admin 03 y 04 (extraer al implementar el segundo)
│   ├── AdminListFilters.tsx                 # pestañas de estado + toggle Todas/Asignadas a mí + slot del botón de calendario
│   ├── AdminStatusChip.tsx
│   ├── AdminPagination.tsx                  # "Mostrando X–Y de Z …" + páginas
│   ├── BeforeResolvingGuide.tsx             # recibe las 3 pautas por props
│   └── AdminListEmptyState.tsx
└── session-claims/
    ├── api/admin-session-claims.api.ts      # list, detail, assign, getContactInfo, resolve
    ├── hooks/
    │   ├── useAdminSessionClaims.ts
    │   ├── useAdminSessionClaimDetail.ts
    │   ├── useAssignSessionClaim.ts
    │   ├── useClaimContactInfo.ts           # enabled solo al abrir el diálogo; gcTime: 0
    │   ├── useResolveSessionClaim.ts
    │   └── useSessionClaimsFilters.ts       # filtros/selección en searchParams
    ├── interfaces/{requests,responses}/…
    ├── schemas/resolve-claim.schema.ts      # favoredParty requerido + justification trim().min(1)
    ├── constants/claim-status-meta.ts       # Record<ClaimStatus, {label, tone, accent}>
    ├── components/
    │   ├── SessionClaimList.tsx
    │   ├── SessionClaimListItem.tsx
    │   ├── SessionClaimDetailPanel.tsx      # orquesta los 4 estados
    │   ├── ClaimSessionSummary.tsx          # materia, sesión, monto retenido
    │   ├── ClaimPartyMessage.tsx            # rol + nombre + burbuja / "No se registró un mensaje"
    │   ├── ClaimResolutionForm.tsx          # selector de parte + textarea + botón
    │   ├── FavoredPartyToggle.tsx
    │   ├── ContactInfoDialog.tsx
    │   └── ConfirmResolutionDialog.tsx
    ├── utils/format-session-date.ts
    ├── styles/session-claims.styles.ts
    └── pages/AdminSessionClaimsPage.tsx
```

## Reglas de implementación

- **Componentes compartidos con Admin 03**: filtros, paginación, chip, guía "Antes de resolver" y estado vacío deben ser los mismos componentes. El orden de implementación sugerido es 03 → 04; al llegar a 04 se extraen a `admin/components/` en vez de copiarlos.
- **URL como estado**: `status`, `scope`, `page`, `selected` vía `useSearchParams`.
- **Formulario**: `react-hook-form` + `zodResolver`. El botón "Confirmar resolución" valida primero y recién después abre `ConfirmResolutionDialog`; la mutación se ejecuta desde el diálogo. Al cancelar el diálogo se conservan los valores del formulario.
- **Datos de contacto sensibles**: `useClaimContactInfo` con `enabled` solo mientras el diálogo está abierto y `gcTime: 0`; sin Zustand, sin `localStorage`, sin logs. Cada apertura dispara una consulta nueva (el backend audita cada una).
- Tras `assign` y `resolve` invalidar `sessionClaims.list`, `sessionClaims.detail(id)` y `dashboard`, usando únicamente `adminQueryKeys`.
- Monto retenido: formateo con `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })`. El diseño muestra "$ 8000" sin separador de miles: se adopta el formateo es-AR y se deja anotado.
- La tipografía de cada parte usa "(Tutor/Tutora)" y "(Alumno/Alumna)" en el diseño; ver decisión abierta 3.
- No tachar el título de los reclamos resueltos (ver decisión abierta 2).
- Fondos: la resolución dispara el pago o reintegro vía Mercado Pago en el backend. El frontend **no** calcula ni muestra el resultado financiero más allá del monto retenido.

---

## Decisiones abiertas

1. **"Citar ambas partes".** Las pautas dicen "podés citarlas para conversar", y en los frames `1253`/`1254` el botón se llama "Citar ambas partes", pero en `1252:3017` el botón equivalente es "Consultar datos de contacto" y abre el diálogo de contacto. No hay flujo definido para "citar" (¿notificación?, ¿chat?, ¿mail?). Propuesta: implementar **solo** "Consultar datos de contacto" y dejar la pauta como texto informativo hasta definir "citar".
2. **Título tachado en "Base de datos" (Resuelto).** La lista del diseño tacha el nombre de un reclamo resuelto, igual que en Denuncias para materiales eliminados. Es probablemente un arrastre del otro diseño; un reclamo resuelto no está "eliminado". No se implementa el tachado.
3. **Género en etiquetas** ("Tutora/Tutor", "Alumna/Alumno"). El modelo de usuario no está confirmado con ese dato. Propuesta: usar etiquetas neutras "Tutor" / "Alumno" salvo que el backend entregue una etiqueta ya resuelta.
4. **Pie de paginación.** Dice "Mostrando 1–4 de 14 archivos" (texto copiado de Denuncias). Debe decir "reclamos". `AdminPagination` recibe el sustantivo por prop.
5. **Fondos tras resolver.** El diálogo promete que "se transferirán los fondos retenidos según lo indicado". Si el pago/reintegro falla en Mercado Pago, hoy solo existe `POST /api/v1/admin/bookings/{bookingId}/funds/retry` y el diseño no tiene UI para reintentar. **Fuera de alcance**; si el backend devuelve éxito parcial, definir cómo se comunica.
6. **Mensaje de cada parte.** El diseño muestra una sola burbuja por parte ("El alumno no pudo asistir. Esperé conectado 20 minutos…"). Confirmar si el backend devuelve motivo + comentario por separado (US-51: motivo obligatorio y comentario opcional) y cómo se compone en pantalla.
7. **Filtro de fecha** (botón calendario/reloj) y **badge del sidebar**: igual que Admin 01 y 03; sin definir.
8. **Longitud máxima de la justificación.** Definir con backend (el diseño no lo indica).
9. **Admin asignado a otro**: misma regla propuesta que en Admin 03 (solo el asignado resuelve; el resto, solo lectura).

## No hacer

- No mostrar el formulario de resolución antes de "Tomar solicitud" ni a un admin que no sea el asignado.
- No permitir editar o revertir una resolución (el diálogo advierte que no se puede modificar).
- No modificar `modules/support/` ni `modules/claim/`.
- No persistir ni loguear teléfonos, emails, DNI ni legajos; no cachear la respuesta de contacto.
- No implementar "Citar ambas partes", reintento de fondos ni filtro de fecha sin definición.
- No calcular fondos en el frontend.
- No `useEffect` + `fetch`, no `any`, no `style={{}}` inline, no colores fuera de `admin-tokens.ts`.
- No duplicar los componentes compartidos con Admin 03.

## Tests

- `resolve-claim.schema`: parte requerida; justificación vacía o solo espacios rechazada.
- `ClaimPartyMessage`: con mensaje y sin mensaje.
- `SessionClaimListItem`: cada estado (franja, chip, acción, "Asignado a", justificación).
- `SessionClaimDetailPanel`: los 4 estados; sin formulario antes de tomar; solo lectura en Resuelto.
- `ClaimResolutionForm` + `ConfirmResolutionDialog`: flujo completo, cancelar conserva valores, error del backend.
- `ContactInfoDialog` / `useClaimContactInfo`: no se consulta hasta abrir; `gcTime: 0`; reabrir vuelve a consultar.
- Mutaciones: invalidación de lista, detalle y dashboard; 409 en `assign`.
- `AdminSessionClaimsPage`: filtros en la URL, paginación, vacío.

## Definition of Done

- [ ] Los 6 frames de Figma cubiertos (sin selección, sin tomar, tomado, contacto, confirmación, vacío)
- [ ] Contrato con backend confirmado y tipos alineados al DTO
- [ ] Tomar, consultar contacto y resolver funcionan y actualizan lista, detalle y Home
- [ ] Componentes compartidos con Admin 03 extraídos a `admin/components/`
- [ ] Datos de contacto sin persistencia ni logs
- [ ] `lint` sin warnings, `type-check`, `format:check` y tests en verde
- [ ] Decisiones abiertas respondidas o anotadas en el PR
