# Admin 03 — Denuncias de material (Frontend)

## Metadatos

| Campo | Valor |
|---|---|
| Módulo frontend | `admin/material-reports` — nuevo |
| Rol | ADMIN |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` / `dev` |
| Ruta | `/admin/material-reports` (deep link opcional: `?selected=<materialId>`) |
| Historias relacionadas | US-27 (denuncia de material, lado alumno), US-17 (baja de material), US-16 (subida) |
| Diseño fuente | Figma `KnowLink (Copy)`: `Denuncia dematerial` `1188:2660` (sin selección), `Denuncia de material (antes de tomar la solicitud)` `1193:3083`, `… (cuando el admin se asignó una revisión)` `1198:3284`, `Denuncias, mensaje de desestimar denuncias` `1199:3747`, `Denuncias, mensaje para dar de baja` `1200:3888`, `… (cuando no hay)` `1270:4702`; panel de detalle asignado `2516:8014` |
| Depende de | Admin 01 (shell) |
| Backend requerido | **No existe en `main`** (ver "Contrato propuesto") |

---

## Estado actual verificado

- Lado tutor ya existe en `src/modules/support/` (`MaterialsTab`, `MaterialListItem`, `MaterialDetailContent`, `SupportStatusChip`, `material-report-status.type.ts`). Sus estados son `PENDING | IN_REVIEW | RESOLVED` y los tonos de chip `warning | info | neutral`.
- El **admin necesita dos resultados distintos** que `RESOLVED` no distingue: **Eliminado** y **Desestimado**. No se modifica el módulo `support`; se define un tipo propio del admin.
- Los textos de `support` (`MaterialsSidebar`) ya prometen al tutor que "un administrador revisa el material denunciado y decide si corresponde darlo de baja": el flujo del admin debe ser coherente con ese texto.
- La notificación `ADMIN_MATERIAL_REPORT_RECEIVED` ya existe en el backend; su destino en el frontend (`/admin/material-reports`) se conecta cuando se decida la campana (ver Admin 01).
- Backend (`main`): no hay controllers de denuncias ni de admin salvo `AdminFundsControllerImpl`.

---

## Pantalla (layout master–detail)

Cabecera: título "Denuncias de material" (700, ~40 px) + subtítulo "Revisa, audita y resuelve reportes de material académico infractor, duplicado o inapropiado subido por la comunidad."

**Barra de filtros**
- Pestañas de estado (chips): **Todo · Pendiente [conteo] · En revisión · Eliminado · Desestimado**. Activa en índigo (`#4F46E5`, texto blanco); el conteo de "Pendiente" va en un badge amarillo.
- Botón-ícono de calendario con reloj (junto a las pestañas). **Función no definida**, ver decisiones abiertas.
- A la derecha, toggle segmentado **Todas | Asignadas a mí**.

**Columna izquierda — lista (≈840 px).** Una fila por **archivo** (los reportes se agrupan por recurso):
- Franja de color a la izquierda por estado: Pendiente = ámbar, En revisión = índigo, Desestimado = verde, Eliminado = rojo.
- Ícono de tipo de archivo (PDF, planilla, adjunto genérico) con **badge circular con la cantidad de reportes** (rojo mientras el archivo está abierto —Pendiente o En revisión—, gris una vez cerrado).
- Nombre del archivo (700) + chip de estado (Pendiente, En revisión, Desestimado, Eliminado). **Eliminado: nombre tachado.**
- Segunda línea: Materia • Tutor titular del material.
- Tercera línea: reloj + tiempo relativo ("Hace 2 horas", "Ayer a las 18:20", "Hace 2 días") y, según estado: "Asignado a: Moderador Carlos V." (En revisión), "Contenido válido bajo revisión académica" (Desestimado), "Material retirado permanentemente" (Eliminado, en rojo).
- Acción a la derecha: **Revisar denuncias** (botón relleno índigo si es Pendiente; outline si En revisión), **Ver detalle** (Desestimado), **Ver resolución** (Eliminado).
- Estados cerrados muestran un bloque **"JUSTIFICACIÓN DEL MODERADOR:"** con el texto de la resolución.
- La fila seleccionada se resalta con borde índigo.
- Pie: "Mostrando **1–4** de **14** archivos" y paginación (« 1 2 3 »).

**Columna derecha — panel de detalle** (≈360 px, tarjeta blanca). Cuatro estados:

| Estado | Contenido |
|---|---|
| **Sin selección** | Título "Seleccioná un material"; texto "Elegí un archivo de la lista para ver las denuncias recibidas y resolverlo."; bloque **ANTES DE RESOLVER** con 3 pautas (ver textos más abajo) |
| **Sin asignar** (`1193:3083`) | "Detalle de la denuncia", subtítulo "Revisión previa a la asignación", badge **Sin asignar**; ficha del tutor titular (nombre, carrera, DNI, Legajo institucional); Recurso; Materia solicitada; "N denuncias asociadas" con la lista (motivo, fecha, comentario o "Sin comentario del denunciante"); botón **Tomar solicitud** + nota "Al tomar la solicitud, el material pasará a estar **En revisión** asignado a tu cuenta." |
| **Asignada a mí** (`2516:8014`) | "En revisión por ADMIN 1" + badge **Asignada**; misma ficha; "Agrupadas por recurso"; botones **Dar de baja** (peligro) y **Desestimar**; nota "Dar de baja remueve el archivo y notifica; Desestimar archiva los reportes." |
| **Cerrada** | Mismo detalle en solo lectura + justificación del moderador (ver "Decisiones abiertas" sobre qué se muestra) |

**Textos de "ANTES DE RESOLVER"** (usar los del estado sin selección con lista de 3 pautas):
1. Descargá y auditá el archivo: los motivos denunciados no siempre reflejan con precisión el contenido real.
2. Dar de baja retira el material para todos los alumnos y notifica al tutor (y a quien denunció). Desestimar mantiene la visibilidad y registra tu nota en auditoría interna.
3. Resolución unificada: si un archivo tiene varias denuncias, tu decisión resuelve todos los tickets simultáneamente.

**Diálogos**
- **¿Dar de baja este material?** — "Dejará de estar disponible para todos los alumnos. Podés dejar un motivo adicional, y se lo notificaremos al tutor junto con los denunciantes." Campo "Motivo …" (opcional según diseño).
- **¿Desestimar esta denuncia?** — "El material seguirá disponible sin cambios y la denuncia quedará archivada como no procedente."

**Estado vacío de la lista**: "No hay denuncias de material para mostrar. Probá con otro filtro o esperá a que un alumno denuncie un archivo." (`EmptyState`). El panel derecho queda en "Sin selección".

---

## Contrato de datos (PROPUESTO — confirmar con backend, no existe en `main`)

Todos con `@PreAuthorize("hasRole('ADMIN')")`.

| Acción | Endpoint propuesto |
|---|---|
| Listar | `GET /api/v1/admin/material-reports?status=&assignedToMe=&page=&size=` |
| Detalle | `GET /api/v1/admin/material-reports/{materialId}` |
| Tomar solicitud | `POST /api/v1/admin/material-reports/{materialId}/assign` (409 si ya la tomó otro admin) |
| Dar de baja | `POST /api/v1/admin/material-reports/{materialId}/remove` body `{ reason?: string }` |
| Desestimar | `POST /api/v1/admin/material-reports/{materialId}/dismiss` body `{ note?: string }` |

```ts
// modules/admin/types/admin-material-report-status.type.ts
export type AdminMaterialReportStatus = "PENDING" | "IN_REVIEW" | "REMOVED" | "DISMISSED";

export interface AdminMaterialReportListItem {
  materialId: string;
  fileName: string;
  fileKind: "PDF" | "SPREADSHEET" | "OTHER"; // para elegir ícono; confirmar valores
  subjectName: string;
  tutorName: string;
  reportsCount: number;
  status: AdminMaterialReportStatus;
  lastReportedAt: string;          // ISO; la UI formatea "Hace 2 horas"
  assignedToName: string | null;
  assignedToMe: boolean;
  resolutionNote: string | null;   // justificación del moderador en estados cerrados
}

export interface AdminMaterialReportListResponse {
  content: AdminMaterialReportListItem[];
  page: number;
  size: number;
  totalElements: number;
  statusCounts: { pending: number; inReview: number; removed: number; dismissed: number };
}

export interface AdminMaterialReportItem {
  reason: string;                  // "Plagio", "Contenido inapropiado"…
  reportedAt: string;
  comment: string | null;          // null => "Sin comentario del denunciante"
}

export interface AdminMaterialReportDetailResponse extends AdminMaterialReportListItem {
  tutor: { fullName: string; career: string; nationalId: string; institutionalFileNumber: string };
  reports: AdminMaterialReportItem[];
}
```

`statusCounts` alimenta el badge de "Pendiente"; el diseño solo muestra conteo en esa pestaña.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Gestión de denuncias de material por el administrador

  Scenario: Ver listado agrupado por archivo
    Given archivos con denuncias
    When el ADMIN abre "/admin/material-reports"
    Then ve una fila por archivo con estado, materia, tutor, tiempo relativo y cantidad de reportes
    And el panel derecho muestra "Seleccioná un material" con las pautas "Antes de resolver"

  Scenario: Filtrar por estado
    When selecciona la pestaña "Pendiente"
    Then la lista solo muestra archivos pendientes
    And la pestaña "Pendiente" muestra el conteo de pendientes

  Scenario: Filtrar por asignación
    When activa "Asignadas a mí"
    Then solo ve archivos asignados a su cuenta

  Scenario: Seleccionar un archivo sin asignar
    Given un archivo en estado Pendiente
    When hace clic en "Revisar denuncias"
    Then la fila queda resaltada
    And el panel muestra "Revisión previa a la asignación" con el badge "Sin asignar"
    And lista los N reportes (motivo, fecha, comentario o "Sin comentario del denunciante")
    And ofrece "Tomar solicitud"

  Scenario: Tomar solicitud
    Given un archivo Pendiente sin asignar
    When hace clic en "Tomar solicitud"
    Then el archivo pasa a "En revisión" asignado al admin
    And el panel muestra "Dar de baja" y "Desestimar"
    And la lista y el conteo de pendientes se actualizan

  Scenario: Otro admin tomó el archivo primero
    Given que otro admin lo tomó antes
    When hace clic en "Tomar solicitud"
    Then el backend responde 409
    And se muestra el mensaje del backend con toast
    And el panel se refresca con el estado real

  Scenario: Dar de baja
    Given un archivo En revisión asignado a mí
    When hace clic en "Dar de baja"
    Then se abre "¿Dar de baja este material?" con campo "Motivo" opcional
    When confirma
    Then el archivo pasa a "Eliminado" con la justificación
    And la fila muestra el nombre tachado y "Material retirado permanentemente"
    And se muestra un toast de éxito

  Scenario: Desestimar
    Given un archivo En revisión asignado a mí
    When hace clic en "Desestimar" y confirma "¿Desestimar esta denuncia?"
    Then el archivo pasa a "Desestimado" y conserva su visibilidad

  Scenario: Resolución unificada
    Given un archivo con 4 reportes
    When resuelve (baja o desestimar)
    Then los 4 reportes quedan resueltos con la misma decisión

  Scenario: Ver una resolución cerrada
    Given un archivo Desestimado o Eliminado
    When hace clic en "Ver detalle" o "Ver resolución"
    Then ve el detalle en solo lectura sin botones de resolución

  Scenario: Sin resultados
    Given que no hay denuncias para el filtro
    Then la lista muestra "No hay denuncias de material para mostrar."

  Scenario: Error al resolver
    Given que el backend devuelve un error
    Then se muestra el "message" del backend en un toast
    And el diálogo permanece abierto para reintentar
```

---

## Estructura de archivos

```
src/modules/admin/
├── types/admin-material-report-status.type.ts
├── constants/admin-query-keys.ts            # materialReports.list(filters), .detail(id)
└── material-reports/
    ├── api/admin-material-reports.api.ts    # getMaterialReports, getMaterialReportDetail, assign…, remove…, dismiss…
    ├── hooks/
    │   ├── useAdminMaterialReports.ts       # useQuery lista (filtros + page), keepPreviousData
    │   ├── useAdminMaterialReportDetail.ts
    │   ├── useAssignMaterialReport.ts       # useMutation
    │   ├── useRemoveMaterial.ts
    │   ├── useDismissMaterialReport.ts
    │   └── useMaterialReportsFilters.ts     # estado de filtros/selección en searchParams
    ├── interfaces/{requests,responses}/…    # un archivo por tipo
    ├── schemas/
    │   ├── remove-material.schema.ts        # { reason?: string } (máx. a confirmar)
    │   └── dismiss-report.schema.ts         # { note?: string }
    ├── constants/material-report-status-meta.ts  # Record<AdminMaterialReportStatus, {label, tone, accent}>
    ├── components/
    │   ├── MaterialReportFilters.tsx
    │   ├── MaterialReportList.tsx
    │   ├── MaterialReportListItem.tsx
    │   ├── FileKindIcon.tsx
    │   ├── ReportsCountBadge.tsx
    │   ├── MaterialReportDetailPanel.tsx    # orquesta los 4 estados
    │   ├── MaterialReportDetailHeader.tsx
    │   ├── TutorOwnerCard.tsx
    │   ├── ReportedItemsList.tsx
    │   ├── ResolutionActions.tsx
    │   ├── BeforeResolvingGuide.tsx
    │   ├── RemoveMaterialDialog.tsx
    │   ├── DismissReportDialog.tsx
    │   └── AdminStatusChip.tsx              # o compartido con Admin 04 (ver abajo)
    ├── utils/relative-time.ts
    ├── styles/material-reports.styles.ts
    └── pages/AdminMaterialReportsPage.tsx
```

## Reglas de implementación

- **Estado de filtros y selección en la URL** (`status`, `scope=mine`, `page`, `selected`) vía `useSearchParams`: permite deep link, refresco y botón "atrás". No usar Zustand para esto.
- Formularios de los diálogos con `react-hook-form` + `zodResolver`; errores del backend con `message` en `toast.error` (sonner), nunca `alert()`.
- Tras `assign`, `remove` y `dismiss`: invalidar `materialReports.list`, `materialReports.detail(id)` y `dashboard` (de Admin 02) desde `admin-query-keys.ts`. Una sola fuente de claves, una sola función de invalidación por mutación.
- Diálogos con `AppConfirmDialog` (severidad `danger` para baja, `warning` para desestimar) extendido si hace falta para incluir un campo de texto, sin duplicarlo.
- `AdminStatusChip`: evaluar reutilizar `SupportStatusChip`; si sus tonos (`warning | info | neutral`) no alcanzan, crear el chip admin con tonos `warning | info | success | danger`. **No modificar `modules/support/`** en esta historia.
- Estado cerrado: nombre del archivo tachado **solo** para `REMOVED`.
- Tiempo relativo: "Hace 2 horas", "Ayer a las 18:20", "Hace 2 días" calculado en cliente desde ISO (`Intl.RelativeTimeFormat("es-AR")` más caso "Ayer a las HH:mm").
- Paginación: la lista muestra 4 por página en el diseño. Definir `ADMIN_LIST_PAGE_SIZE` como constante única (compartida con Admin 04) y confirmar el valor real.
- Nombres de archivo largos: truncar con ellipsis y `title` (en el detalle el mock muestra "GuíaDeIntegrale…").
- Datos personales del tutor (DNI, legajo): solo en memoria de la query de detalle. No guardarlos en Zustand ni en `localStorage`, no loguearlos.
- Descarga del archivo para auditar: ver decisión abierta 1.

---

## Decisiones abiertas

1. **Descarga del material.** La pauta dice "Descargá y auditá el archivo", pero el detalle del diseño solo muestra el nombre del recurso, sin botón de descarga ni vista previa. Propuesta: que el campo "Recurso" sea un enlace de descarga (URL firmada de Supabase Storage generada por el backend). Falta definir el endpoint.
2. **Botón de calendario/reloj** junto a las pestañas: no tiene etiqueta ni comportamiento en el diseño. Hipótesis: filtro por rango de fechas u orden por antigüedad. **No implementar hasta definirlo.**
3. **Admin asignado a otro.** El panel de `1199`/`1200` dice "A cargo de Admin 2" y a la vez muestra los diálogos de resolución. Regla propuesta: solo el admin asignado puede resolver; el resto ve el detalle en solo lectura. Confirmar.
4. **Nota al desestimar.** Los textos de "Antes de resolver" dicen que al desestimar "tu nota queda solo para uso interno", pero el diálogo del diseño no muestra campo de nota. Propuesta: campo opcional. Confirmar si es obligatorio.
5. **Motivo de la baja opcional u obligatorio.** El diálogo dice "Podés dejar un motivo adicional" → opcional. Confirmar largo máximo con backend.
6. **Ficha del "tutor".** En los mocks la lista muestra "Silvina Rubio" como tutor del archivo y el detalle muestra "Juana Pérez". Se asume que ambos son el tutor titular del material; es inconsistencia de datos del mock.
7. **Terminología.** El estado se llama "Eliminado" en filtros y chips; en la Home/logout aparece "Material dado de baja". Se usa "Eliminado" (chip) y "Dar de baja" (acción), como en esta pantalla.
8. **Valores de `fileKind`** y los íconos por tipo (PDF, planilla, adjunto): confirmar qué tipos admite el backend (reglas en `support/constants/file-format.constants.ts` ya existentes, reutilizables).
9. **Badge del sidebar** (ver Admin 01).

## No hacer

- No modificar `modules/support/` ni sus tipos (`MaterialReportStatus`).
- No resolver denuncias individuales dentro de un archivo: la decisión es **por archivo** y resuelve todas.
- No mostrar acciones de resolución en filas Desestimadas/Eliminadas.
- No llamar a axios desde componentes; no `useEffect` + `fetch`.
- No guardar filtros ni selección en Zustand.
- No persistir ni loguear DNI, legajo ni datos de contacto.
- No usar `any`, `style={{}}` inline ni colores fuera de `admin-tokens.ts`.
- No inventar el endpoint de descarga ni el comportamiento del botón de calendario.

## Tests

- `material-report-status-meta`: `Record` exhaustivo (falla compilación si falta un estado).
- `relative-time`: "Hace 2 horas", "Ayer a las 18:20", "Hace 2 días".
- `MaterialReportListItem`: cada estado (franja, chip, acciones, tachado, justificación).
- `MaterialReportDetailPanel`: los 4 estados y "Sin comentario del denunciante".
- `RemoveMaterialDialog` / `DismissReportDialog`: validación, éxito, error del backend.
- Hooks de mutación: invalidación de lista, detalle y dashboard; 409 en `assign`.
- `AdminMaterialReportsPage`: filtros sincronizados con la URL, paginación, vacío.

## Definition of Done

- [ ] Los 6 frames de Figma cubiertos (sin selección, sin asignar, asignada, diálogo baja, diálogo desestimar, vacío)
- [ ] Contrato con backend confirmado y tipos alineados al DTO
- [ ] Tomar / dar de baja / desestimar funcionan y actualizan lista, detalle y Home
- [ ] Filtros, página y selección persisten en la URL
- [ ] Datos personales no se persisten ni se loguean
- [ ] `lint` sin warnings, `type-check`, `format:check` y tests en verde
- [ ] Decisiones abiertas respondidas o anotadas en el PR
