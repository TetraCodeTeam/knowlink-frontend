# Admin 03 — Plan de desarrollo (Denuncias de material, frontend)

> Documento de trabajo derivado de [`admin-03-denuncias-material-frontend.spec.md`](./admin-03-denuncias-material-frontend.spec.md).
> Rama: `feature/admin-frontend`.

## 1. Resumen

Implementa la pantalla master–detail de denuncias de material para el rol ADMIN:
listado agrupado por archivo, filtros por estado y asignación en la URL, panel de
detalle con cuatro estados (sin selección, sin asignar, asignada a mí y cerrada),
toma de solicitud, baja y desestimación con resolución unificada por archivo.

El backend de este contrato **no existe en `main`**. La capa `api/` se implementa
contra el contrato propuesto del spec y los tests la mockean, igual que Admin 02.

**Estimación:** 2–3 días de desarrollo + verificación visual contra Figma.

## 2. Alcance

**Incluye**

- Tipos propios del admin (`AdminMaterialReportStatus`, listado y detalle).
- Claves de React Query (`materialReports.list` / `.detail`) e invalidación única
  de lista, detalle y dashboard.
- API, hooks de query/mutación y schemas de los diálogos.
- Pantalla `/admin/material-reports` con filtros, listado paginado, panel de
  detalle, pautas "Antes de resolver" y estado vacío.
- Diálogos de baja y desestimación con `AppConfirmDialog` extendido con contenido.
- Chip admin con tonos `warning | info | success | danger` sin tocar `support/`.
- Tests de metadatos, tiempo relativo, fila, panel, diálogos, hooks y página.

**No incluye**

- Backend nuevo ni cambios en `knowlink-backend`.
- Botón de calendario/reloj (decisión abierta 2: no implementar).
- Descarga o preview del recurso (decisión abierta 1: sin endpoint definido).
- Badge del sidebar y campana de notificaciones (Admin 01 / US-35).
- Cambios en `modules/support/` ni en el `MaterialReportStatus` del tutor.

## 3. Decisiones abiertas: defaults aplicados

| # | Decisión | Default aplicado |
|---|---|---|
| 1 | Descarga del material | "Recurso" es texto, sin enlace. No se inventa endpoint. |
| 2 | Botón de calendario/reloj | No se renderiza. |
| 3 | Admin asignado a otro | Solo `assignedToMe` ve "Dar de baja" y "Desestimar"; el resto ve solo lectura. |
| 4 | Nota al desestimar | Campo opcional "Nota interna (opcional)", máximo 500 caracteres. |
| 5 | Motivo de baja | Opcional, máximo 500 caracteres. |
| 6 | Ficha del tutor | Se usa `detail.tutor` como tutor titular del material. |
| 7 | Terminología | Chip "Eliminado"; acción "Dar de baja". |
| 8 | `fileKind` | `PDF | SPREADSHEET | OTHER`, con fallback visual a `OTHER`. |
| 9 | Badge del sidebar | Fuera de alcance. |

## 4. Plan por fases

### Fase 0 — Preparación

- [x] Relevar patrones de Admin 01/02, `support/`, `AppConfirmDialog` y tests.
- [x] Confirmar que el backend del contrato no existe en `main`.
- [x] Línea base: `lint`, `type-check`, `test`, `format:check`.

### Fase 1 — Dominio y contrato

- [x] `types/admin-material-report-status.type.ts`.
- [x] Interfaces de request/response del listado y detalle.
- [x] `admin-query-keys.ts`: `materialReports.list(filters)` y `.detail(id)`.
- [x] `constants/admin-pagination.constants.ts` con `ADMIN_LIST_PAGE_SIZE = 4`.
- [x] `material-report-status-meta.ts` como `Record` exhaustivo.
- [x] Tokens faltantes en `admin-tokens.ts` (ámbar/verde suaves).

### Fase 2 — Datos

- [x] `admin-material-reports.api.ts` con listar, detalle, assign, remove y dismiss.
- [x] `useAdminMaterialReports` con `keepPreviousData`.
- [x] `useAdminMaterialReportDetail` habilitado solo con selección.
- [x] `useAssignMaterialReport`, `useRemoveMaterial`, `useDismissMaterialReport`.
- [x] Invalidación única (lista, detalle, dashboard) y toast con `message` del backend.
- [x] `useMaterialReportsFilters` con `status`, `scope`, `page`, `selected` en la URL.

### Fase 3 — UI de lista y filtros

- [x] `MaterialReportFilters` (chips de estado + conteo + toggle Todas/Asignadas).
- [x] `MaterialReportList` con pie "Mostrando X–Y de Z archivos" y paginación.
- [x] `MaterialReportListItem` con franja, ícono, badge, chip, tiempo relativo,
      asignación, justificación, tachado solo para `REMOVED` y acción por estado.
- [x] `FileKindIcon`, `ReportsCountBadge`, `AdminStatusChip`.
- [x] `relative-time` con "Hace 2 horas", "Ayer a las 18:20", "Hace 2 días".
- [x] `EmptyState` con el texto del spec.

### Fase 4 — Panel de detalle y diálogos

- [x] `MaterialReportDetailPanel` con los 4 estados.
- [x] `MaterialReportDetailHeader`, `TutorOwnerCard`, `ReportedItemsList`,
      `BeforeResolvingGuide`, `ResolutionActions`.
- [x] `RemoveMaterialDialog` y `DismissReportDialog` con RHF + Zod.
- [x] `AppConfirmDialog` acepta `content` para no duplicar el diálogo.
- [x] Errores del backend en `toast.error`; el diálogo queda abierto.
- [x] Datos personales solo en la query de detalle (sin store ni logs).

### Fase 5 — Página y ruta

- [x] `AdminMaterialReportsPage` compone cabecera, filtros, lista y panel.
- [x] `AdminRoutes` monta la página en `/admin/material-reports`.
- [x] Deep link `?selected=<materialId>` y refresco conservan estado.
- [x] Error de lista con "Reintentar"; error de detalle con "Reintentar".

### Fase 6 — Tests y verificación

- [x] `materialReportStatusMeta.test.ts`.
- [x] `relativeTime.test.ts`.
- [x] `MaterialReportListItem.test.tsx`.
- [x] `MaterialReportDetailPanel.test.tsx`.
- [x] `RemoveMaterialDialog.test.tsx` / `DismissReportDialog.test.tsx`.
- [x] `adminMaterialReportHooks.test.tsx`.
- [x] `AdminMaterialReportsPage.test.tsx`.
- [x] `npm run lint`, `npm run type-check`, `npm run test`, Prettier de los archivos nuevos.

## 5. Trazabilidad Gherkin → implementación

| Escenario | Implementación | Test |
|---|---|---|
| Listado agrupado por archivo | `MaterialReportList` + `MaterialReportListItem` | Page + ListItem |
| Panel inicial "Seleccioná un material" | `MaterialReportDetailPanel` + `BeforeResolvingGuide` | Panel |
| Filtrar por estado y conteo | `MaterialReportFilters` + `useMaterialReportsFilters` | Page |
| Filtrar "Asignadas a mí" | `scope=mine` → `assignedToMe=true` | Page |
| Seleccionar archivo sin asignar | `?selected=` + panel PENDING | Panel |
| Tomar solicitud | `useAssignMaterialReport` + invalidación | Hooks |
| Otro admin tomó primero (409) | `onError` → toast + invalidación del detalle | Hooks |
| Dar de baja | `RemoveMaterialDialog` | Dialog |
| Desestimar | `DismissReportDialog` | Dialog |
| Resolución unificada | endpoint por `materialId` (no por reporte) | API |
| Ver resolución cerrada | panel sin acciones + justificación | Panel |
| Sin resultados | `EmptyState` | Page |
| Error al resolver | `toast.error(message)` y diálogo abierto | Dialog/Hooks |

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El backend real resuelve por reporte, no por archivo | La capa `api/` aísla el contrato; ajustar solo ahí cuando backend confirme. |
| Duplicar estilos del tutor | Tokens y estilos propios de admin; solo se reutilizan conceptos visuales. |
| Invalidar de menos | Helper único que invalida lista, detalle y dashboard. |
| Filtros en Zustand | Todo en `useSearchParams`; sin store. |
| Datos personales persistidos | Solo viven en la caché de la query de detalle. |
| Nota/motivo sin límite real | 500 caracteres por default, centralizado para cambiarlo. |
| Diálogo se cierra ante error | `onClose` solo tras `mutateAsync` exitoso. |

## 7. Inventario de archivos

**Nuevos**

| Archivo | Responsabilidad |
|---|---|
| `src/modules/admin/types/admin-material-report-status.type.ts` | Estados, tipo de archivo y filtros |
| `src/modules/admin/constants/admin-pagination.constants.ts` | Tamaño de página compartido con Admin 04 |
| `src/modules/admin/material-reports/api/admin-material-reports.api.ts` | Contrato HTTP |
| `src/modules/admin/material-reports/hooks/*` | Queries, mutaciones y filtros de URL |
| `src/modules/admin/material-reports/interfaces/**` | Requests y responses |
| `src/modules/admin/material-reports/schemas/*` | Motivo y nota |
| `src/modules/admin/material-reports/constants/material-report-status-meta.ts` | `Record` de estados |
| `src/modules/admin/material-reports/components/*` | Lista, panel, fichas y diálogos |
| `src/modules/admin/material-reports/utils/*` | Tiempo relativo e invalidación |
| `src/modules/admin/material-reports/styles/material-reports.styles.ts` | Estilos |
| `src/modules/admin/material-reports/pages/AdminMaterialReportsPage.tsx` | Página |

**Modificados**

| Archivo | Cambio |
|---|---|
| `src/modules/admin/constants/admin-query-keys.ts` | Claves de material reports |
| `src/modules/admin/styles/admin-tokens.ts` | Tonos ámbar/verde |
| `src/shared/components/AppConfirmDialog.tsx` | Slot `content` |
| `src/routes/AdminRoutes.tsx` | Monta la página |

## 8. Commits sugeridos

```
docs: agrega el plan de denuncias de material del administrador
feat: agrega contrato y hooks de denuncias de material
feat: agrega listado y filtros de denuncias de material
feat: agrega panel de detalle y resolucion de denuncias
test: cubre denuncias de material del administrador
```