# Admin 04 — Plan de desarrollo (Reclamos de sesiones, frontend)

> Documento de trabajo derivado de [`admin-04-reclamos-sesiones-frontend.spec.md`](./admin-04-reclamos-sesiones-frontend.spec.md).
> Rama: `feature/admin-frontend`.
> Estado: **implementado con mocks** (`VITE_ADMIN_SESSION_CLAIMS_MOCKS`, activo por defecto).

## 1. Resumen

Implementa la pantalla master–detail de reclamos de sesión para el rol ADMIN:
listado con filtros por estado y asignación en la URL, panel de detalle con los
estados "sin selección", "sin tomar", "tomado por mí", "tomado por otro" y
"resuelto", toma de solicitud, consulta auditada de datos de contacto y
resolución a favor de alumno o tutor con justificación obligatoria.

Además extrae a `admin/components/` los componentes que Admin 03 dejó dentro de
`material-reports/` (filtros, chip, paginación, guía "Antes de resolver" y estado
vacío), para que Admin 04 los reutilice sin duplicarlos.

El backend de este contrato **no existe en `dev/main`**: solo están los endpoints
del alumno/tutor de US-51. Por eso la pantalla se implementó completa contra un
**backend simulado en memoria** (`session-claims/mocks/session-claims.mock.ts`):
lista, detalle, toma, contacto y resolución funcionan de punta a punta con 14
reclamos semilla, latencia simulada y errores 404/403/409.

Los mocks están activos por defecto y se apagan con
`VITE_ADMIN_SESSION_CLAIMS_MOCKS=false`, momento en el que la capa `api/` empieza
a pegarle al contrato real del spec sin tocar componentes ni hooks. Ese switch es
el único punto de acoplamiento con el backend.

**Estimación:** 3–4 días de desarrollo (≈0,5 día de extracción de compartidos) +
verificación visual contra los 6 frames de Figma.

## 2. Alcance

**Incluye**

- Extracción de los componentes compartidos de Admin 03 a `src/modules/admin/`.
- Tipos propios del admin: `ClaimFavoredParty`, filtros y scope de reclamos.
- Reutilización de `ClaimStatus` desde `modules/support` (sin modificarlo).
- Claves de React Query (`sessionClaims.list`, `.detail`, `.contact`) e invalidación
  única de lista, detalle y dashboard.
- API, hooks de query/mutación, schema de resolución y formateo de fecha/monto.
- Pantalla `/admin/session-claims` con filtros, listado paginado, panel de detalle,
  pautas "Antes de resolver", estado vacío y errores con "Reintentar".
- Toma de solicitud (con manejo de 409), diálogo de datos de contacto (efímero) y
  flujo de resolución con confirmación.
- Tests de schema, metadatos, fecha, fila, panel, diálogos, hooks y página.

**No incluye**

- Backend nuevo ni cambios en `knowlink-backend`.
- Acción "Citar ambas partes" (decisión abierta 1: solo texto informativo).
- Reintento de fondos ante fallo de Mercado Pago (decisión abierta 5).
- Filtro por fecha/calendario y badge numérico del sidebar (decisión abierta 7).
- Cambios en `modules/support/`, `modules/claim/` ni en el flujo de reclamo del
  alumno/tutor.
- Edición o reversión de una resolución ya confirmada.

## 3. Decisiones abiertas: defaults aplicados

| # | Decisión | Default aplicado |
|---|---|---|
| 1 | "Citar ambas partes" | No se implementa. Solo se ofrece "Consultar datos de contacto"; la pauta queda como texto informativo. |
| 2 | Título tachado en resueltos | No se tacha: un reclamo resuelto no está eliminado. |
| 3 | Género en etiquetas | Etiquetas neutras "Tutor" / "Alumno". Si el backend envía el rol resuelto, se usa tal cual. |
| 4 | Sustantivo del pie de página | `AdminPagination` recibe `noun`; Admin 04 pasa "reclamos". |
| 5 | Fondos tras resolver | Fuera de alcance. El frontend solo muestra el monto retenido y confía en el resultado del backend. |
| 6 | Mensaje de cada parte | Un único `message: string | null` por parte; `null` renderiza "No se registró un mensaje". Si el backend separa motivo y comentario, se compone solo en `ClaimPartyMessage`. |
| 7 | Filtro de fecha y badge del sidebar | No se renderizan. `AdminListFilters` deja un slot `trailingAction` reservado. |
| 8 | Longitud de la justificación | Máximo 500 caracteres, centralizado en `SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH`; anotar en el PR para confirmar con backend. |
| 9 | Admin asignado a otro | Solo el asignado resuelve; el resto ve el detalle en solo lectura con la nota "Solo el administrador asignado puede resolver este reclamo." |
| 10 | Formato de fecha | `22 de julio` (es-AR), precedido por "Sesión del " en la lista. No se usa el texto literal "22 julio" del diseño. |
| 11 | Texto de la acción de fila | "Revisar" en todos los estados, con variante rellena en Pendiente y outline en el resto (se sigue el spec al pie de la letra). |

## 4. Contrato propuesto y frontera con backend

| Acción | Endpoint | Notas de implementación |
|---|---|---|
| Listar | `GET /api/v1/admin/session-claims` | `status`, `assignedToMe`, `page` (frontend 1-based → backend 0-based), `size=4`. |
| Detalle | `GET /api/v1/admin/session-claims/{claimId}` | Habilita el panel cuando hay `?selected=`. |
| Tomar | `POST /api/v1/admin/session-claims/{claimId}/assign` | 409 si otro admin lo tomó. |
| Contacto | `GET /api/v1/admin/session-claims/{claimId}/contact-info` | El backend audita cada consulta; el frontend no cachea. |
| Resolver | `POST /api/v1/admin/session-claims/{claimId}/resolve` | Body `{ favoredParty, justification }`. |

La capa `api/admin-session-claims.api.ts` es la única que conoce estas rutas. Si el
backend confirma nombres o payloads distintos, se ajusta solo ese archivo y sus
interfaces.

## 5. Plan por fases

### Fase 0 — Preparación

- [ ] Leer el spec completo y los frames de Figma (6 estados).
- [ ] Confirmar con backend el contrato y las decisiones 6, 8 y 9.
- [x] Relevar patrones de Admin 03 (`material-reports/`), `AppConfirmDialog`,
      `AppButton`, `EmptyState`, `httpClient` y los tests existentes.
- [x] Línea base en verde: `npm run lint`, `npm run type-check`, `npm run test`,
      `npm run format:check`.

### Fase 1 — Extracción de componentes compartidos (Admin 03 → `admin/`)

- [x] Crear `admin/constants/admin-status-meta.ts` con `AdminStatusTone` y
      `AdminStatusMeta`; mover el tipo desde `material-report-status-meta.ts`.
- [x] Crear `admin/styles/admin-list.styles.ts` con filtros, tabs, toggle de scope,
      tarjeta/lista, franja, fila base, chip, guía, paginación, vacío y errores.
- [x] Mover a `admin/components/`:
      `AdminListFilters`, `AdminStatusChip`, `AdminPagination`,
      `BeforeResolvingGuide` (pautas por props) y `AdminListEmptyState`.
- [x] Adaptar `MaterialReportFilters` para que sea un adaptador fino de
      `AdminListFilters` con sus 5 tabs y el conteo de Pendiente.
- [x] Reemplazar la paginación inline de `MaterialReportList` por `AdminPagination`
      con `noun="archivos"`.
- [x] Actualizar imports de Admin 03 y borrar los componentes duplicados.
- [x] Verificar que Admin 03 se ve y se comporta igual: tests de Admin 03 en verde.

### Fase 2 — Dominio y contrato

- [x] `types/claim-favored-party.type.ts` (`"STUDENT" | "TUTOR"`).
- [x] `types/admin-session-claim-filters.type.ts`
      (`AdminSessionClaimStatusFilter = "ALL" | ClaimStatus`, `AdminSessionClaimScope`).
- [x] Importar `ClaimStatus` desde `@/modules/support/interfaces/claim-status.type`
      sin tocar `support/`.
- [x] Interfaces de request: listado y resolución.
- [x] Interfaces de response: ítem, lista + `statusCounts`, detalle, partes y
      contacto.
- [x] `admin-query-keys.ts`: `sessionClaimsBase`, `sessionClaims.list(filters)`,
      `.detail(claimId)` y `.contact(claimId)`.
- [x] `constants/claim-status-meta.ts`: `Record<ClaimStatus, { label, tone, accent }>`
      con Pendiente/En revisión/Resuelto y ámbar/índigo/verde.
- [x] `constants/session-claims.constants.ts`: textos, límite de justificación y
      largo de página (reutiliza `ADMIN_LIST_PAGE_SIZE`).

### Fase 3 — Datos

- [x] `api/admin-session-claims.api.ts` con `list`, `detail`, `assign`,
      `getContactInfo` y `resolve`, usando `rawHttpClient`.
- [x] `useAdminSessionClaims(filters)` con `keepPreviousData`, `staleTime` 30 s y
      tamaños de página compartidos.
- [x] `useAdminSessionClaimDetail(claimId)` habilitado solo con selección.
- [x] `useAssignSessionClaim(claimId)`: toast de éxito y, ante 409, toast con el
      `message` del backend + invalidación para refrescar el estado real.
- [x] `useResolveSessionClaim(claimId)`: invalida lista, detalle y dashboard.
- [x] `useClaimContactInfo(claimId, enabled)`: `enabled` solo con el diálogo abierto,
      `gcTime: 0`, `staleTime: 0`, `retry: 0`; reabrir vuelve a consultar.
- [x] `utils/invalidate-session-claim-queries.ts`: helper único que invalida
      `sessionClaimsBase`, `sessionClaims.detail(id)` y `dashboardBase`.
- [x] `useSessionClaimsFilters`: `status`, `scope`, `page`, `selected` en
      `useSearchParams`; sin Zustand.

### Fase 4 — Lista y filtros

- [x] `SessionClaimList` con encabezado, conteo, skeleton, estado vacío y pie
      "Mostrando X–Y de Z reclamos".
- [x] `SessionClaimListItem` con franja por estado, materia + chip, línea de partes,
      línea "Sesión del …" + "Asignado a:" en revisión, justificación en resueltos y
      acción "Revisar" (primaria en Pendiente, outline en el resto).
- [x] `AdminSessionClaimsPage`: cabecera, `AdminListFilters` con tabs
      Todo · Pendiente [conteo] · En revisión · Resuelto y toggle Todas/Asignadas a mí.
- [x] Estados de error de lista con "Reintentar" y `role="alert"`.
- [x] `format-session-date.ts` que parsee fechas `yyyy-MM-dd` sin corrimiento de zona
      horaria y devuelva "22 de julio".
- [x] `format-held-amount.ts` (o helper local) con
      `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })`.

### Fase 5 — Panel de detalle y diálogos

- [x] `SessionClaimDetailPanel` orquesta: sin selección, carga, error y los cuatro
      estados de negocio (sin tomar, tomado por mí, tomado por otro, resuelto).
- [x] Sin selección: "Seleccioná un reclamo" + subtítulo + `BeforeResolvingGuide`
      con las 3 pautas del spec.
- [x] `ClaimSessionSummary` con "Materia solicitada", "Sesión" y "Monto retenido".
- [x] `ClaimPartyMessage` para tutor y alumno; `null` → ícono tachado +
      "No se registró un mensaje".
- [x] Sin tomar: botón "Tomar solicitud" + nota de que pasa a En revisión y queda
      asignado a la cuenta.
- [x] Tomado por mí: botón outline "Consultar datos de contacto" + `ClaimResolutionForm`.
- [x] Tomado por otro: datos en solo lectura + nota de que solo el asignado resuelve.
- [x] Resuelto: solo lectura con "Justificación del administrador".
- [x] `FavoredPartyToggle` con dos opciones (Alumno/Tutor), `aria-pressed` y error
      "Elegí a favor de quién resolver".
- [x] `ClaimResolutionForm` con RHF + `zodResolver`:
      `favoredParty` requerido y `justification` con `trim().min(1)` y máximo 500.
      El botón "Confirmar resolución" valida y recién ahí abre el diálogo.
- [x] `ConfirmResolutionDialog` reutilizando `AppConfirmDialog` (severity warning,
      título "¿Confirmar esta resolución?", mensaje y advertencia del spec).
      La mutación se ejecuta desde el diálogo; cancelar conserva los valores.
      Ante error del backend: toast con su `message`, el diálogo se cierra y el
      formulario conserva parte elegida y justificación (comportamiento del spec).
- [x] `ContactInfoDialog`: una tarjeta por parte con iniciales, nombre, rol, teléfono,
      email e institución/legajo (tutor) o identificación/DNI (alumno); "Cerrar";
      estados de carga y error con reintento.
- [x] Sin persistencia de datos de contacto: sin Zustand, sin `localStorage`, sin logs.

### Fase 6 — Página y ruta

- [x] Montar `AdminSessionClaimsPage` en `AdminRoutes` en lugar de
      `UnderConstructionPage` para `session-claims`.
- [x] Verificar que el sidebar y la tarjeta del Home ya apuntan a la ruta.
- [x] Deep link `?selected=<claimId>` vuelve a abrir el panel correcto.
- [x] Filtros, paginación y selección sobreviven al refresco y al botón "atrás".
- [x] Cambiar estado, scope o página limpia `selected` para que el panel nunca muestre un reclamo fuera del listado visible; el deep link inicial se conserva.
      en la lista (o se conserva solo si sigue visible, a definir en implementación).

### Fase 7 — Tests y verificación

- [x] `test/modules/admin/session-claims/fixtures.ts` con ítem, lista, detalle,
      contacto y conteos.
- [x] `resolveClaimSchema.test.ts`: parte requerida; justificación vacía o solo
      espacios rechazada; máximo respetado.
- [x] `sessionClaimStatusMeta.test.ts`: `Record` exhaustivo, labels/tonos/acentos.
- [x] `formatSessionDate.test.ts`: fecha sin corrimiento de día y monto es-AR.
- [x] `SessionClaimListItem.test.tsx`: los 3 estados (franja, chip, acción,
      "Asignado a", justificación).
- [x] `SessionClaimDetailPanel.test.tsx`: los 5 estados; sin formulario antes de
      tomar; solo lectura para otro admin y para resuelto.
- [x] `ClaimPartyMessage.test.tsx`: con mensaje y sin mensaje.
- [x] `ClaimResolutionForm.test.tsx` (incluye el diálogo de confirmación): validación,
      apertura del diálogo, flujo completo, cancelar conserva valores, error del
      backend cierra el diálogo sin borrar valores.
- [x] `ContactInfoDialog.test.tsx`: no consulta hasta abrir; cerrar oculta los datos y
      reabrir dispara una segunda consulta (sin caché visible entre aperturas).
- [x] `adminSessionClaimHooks.test.tsx`: invalidación de lista, detalle y dashboard;
      409 en `assign` con `message` del backend; error en `resolve`.
- [x] `AdminSessionClaimsPage.test.tsx`: filtros y paginación en la URL, conteo en
      Pendiente, vacío, deep link y error con reintento.
- [x] Ejecutar `npm run lint`, `npm run type-check`, `npm run test`,
      `npm run format:check` y Prettier sobre los archivos nuevos.
- [ ] Verificación visual contra los 6 frames de Figma.

## 6. Trazabilidad Gherkin → implementación → test

| Escenario | Implementación | Test |
|---|---|---|
| Ver listado | `SessionClaimList` + `SessionClaimListItem` + panel inicial | Page + ListItem |
| Filtrar por estado y conteo | `AdminListFilters` + `useSessionClaimsFilters` | Page |
| Filtrar "Asignadas a mí" | `scope=mine` → `assignedToMe=true` | Page |
| Abrir reclamo sin tomar | `?selected=` + panel PENDING | Panel |
| Parte sin mensaje | `ClaimPartyMessage` | ClaimPartyMessage |
| Tomar solicitud | `useAssignSessionClaim` + invalidación | Hooks |
| Otro admin lo tomó (409) | `onError` → toast + invalidación | Hooks |
| Consultar datos de contacto | `ContactInfoDialog` + `useClaimContactInfo` | Dialog/Hooks |
| Resolver sin elegir parte | schema `favoredParty` requerido | Schema + Form |
| Resolver sin justificación | `trim().min(1)`; no abre diálogo | Schema + Form |
| Confirmar resolución | form → `ConfirmResolutionDialog` → mutate | Form/Dialog + Hooks |
| Reclamo resuelto | panel solo lectura + justificación | Panel |
| Error al resolver | toast con `message`; diálogo se cierra y conserva valores | Dialog/Hooks |
| Sin resultados | `AdminListEmptyState` con el texto del spec | Page |

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El backend real difiere del contrato propuesto | Toda la traducción HTTP vive en `admin-session-claims.api.ts`; ajustar solo ahí e interfaces. |
| Romper Admin 03 al extraer compartidos | Extracción en fase separada, sin cambios de comportamiento, con los tests de Admin 03 como red. |
| Datos de contacto cacheados o persistidos | `gcTime: 0`, sin store ni storage, sin logs; se verifica que no haya persister de React Query. |
| Reabrir el diálogo no vuelve a auditar | `gcTime: 0` + `enabled` por apertura + test explícito de segunda llamada. |
| Fechas con corrimiento de día | Parsear `yyyy-MM-dd` como fecha local (partes), no `new Date("yyyy-MM-dd")` (UTC). |
| Doble resolución por doble clic | Botón y confirmación deshabilitados con `isPending`; invalidación al terminar. |
| Perder lo escrito al cancelar o fallar | El formulario vive en el panel; el diálogo solo confirma. No se resetea al cerrar. |
| Invalidar de menos | Helper único `invalidateSessionClaimQueries` (lista, detalle y dashboard). |
| Duplicar UI de Admin 03 | Componentes compartidos en `admin/`; Admin 04 no copia estilos ni filas. |
| Importar `ClaimStatus` desde `support` | Permitido por el spec; solo lectura del tipo, sin modificar `modules/support/`. |

## 8. Inventario de archivos

**Nuevos**

| Archivo | Responsabilidad |
|---|---|
| `src/modules/admin/constants/admin-status-meta.ts` | `AdminStatusTone` y metadatos compartidos |
| `src/modules/admin/styles/admin-list.styles.ts` | Estilos compartidos de listas admin |
| `src/modules/admin/components/AdminListFilters.tsx` | Tabs de estado + toggle de scope + slot |
| `src/modules/admin/components/AdminStatusChip.tsx` | Chip con tono |
| `src/modules/admin/components/AdminPagination.tsx` | Pie "Mostrando X–Y de Z" + páginas |
| `src/modules/admin/components/BeforeResolvingGuide.tsx` | Pautas por props |
| `src/modules/admin/components/AdminListEmptyState.tsx` | Vacío con ícono y mensaje |
| `src/modules/admin/types/claim-favored-party.type.ts` | Parte favorecida |
| `src/modules/admin/types/admin-session-claim-filters.type.ts` | Filtros y scope |
| `src/modules/admin/session-claims/api/admin-session-claims.api.ts` | Contrato HTTP |
| `src/modules/admin/session-claims/hooks/*` | Queries, mutaciones y filtros de URL |
| `src/modules/admin/session-claims/interfaces/**` | Requests y responses |
| `src/modules/admin/session-claims/schemas/resolve-claim.schema.ts` | Validación de resolución |
| `src/modules/admin/session-claims/constants/claim-status-meta.ts` | `Record` de estados |
| `src/modules/admin/session-claims/constants/session-claims.constants.ts` | Textos y límites |
| `src/modules/admin/session-claims/components/*` | Lista, panel, partes, formulario y diálogos |
| `src/modules/admin/session-claims/utils/*` | Fecha, monto e invalidación |
| `src/modules/admin/session-claims/styles/session-claims.styles.ts` | Estilos propios |
| `src/modules/admin/session-claims/pages/AdminSessionClaimsPage.tsx` | Página |
| `test/modules/admin/session-claims/**` | Fixtures y tests |

**Modificados**

| Archivo | Cambio |
|---|---|
| `src/modules/admin/constants/admin-query-keys.ts` | Claves de session claims |
| `src/modules/admin/material-reports/components/*` | Consumen los compartidos |
| `src/modules/admin/material-reports/styles/material-reports.styles.ts` | Se recortan estilos movidos |
| `src/modules/admin/material-reports/constants/material-report-status-meta.ts` | Importa `AdminStatusTone` compartido |
| `src/routes/AdminRoutes.tsx` | Monta `AdminSessionClaimsPage` |
| `docs/admin-04-reclamos-sesiones-frontend.plan.md` | Este documento |

## 9. Commits sugeridos

```
docs: agrega el plan de reclamos de sesiones del administrador
refactor: extrae componentes de lista compartidos del administrador
feat: agrega contrato y hooks de reclamos de sesiones
feat: agrega listado y filtros de reclamos de sesiones
feat: agrega panel de detalle y resolucion de reclamos
test: cubre reclamos de sesiones del administrador
```

## 10. Estado de verificación

- `npm run lint`: verde.
- `npm run type-check`: verde.
- `npm run test`: 300 tests en 58 archivos, todos en verde (46 son de Admin 04).
- `npm run format:check`: verde.
- Admin 03 conserva sus 45 tests originales en verde tras la extracción.
- Mock por defecto: `VITE_ADMIN_SESSION_CLAIMS_MOCKS` ausente o distinto de
  `false` usa el store en memoria; `false` usa `rawHttpClient`.

Pendiente de validación externa: contrato real con backend y comparación visual
contra los 6 frames de Figma.

## 11. Definition of Done

- [ ] Los 6 frames de Figma cubiertos (sin selección, sin tomar, tomado,
      contacto, confirmación y vacío).
- [ ] Contrato con backend confirmado y tipos alineados al DTO.
- [x] Tomar, consultar contacto y resolver actualizan lista, detalle y Home.
- [x] Componentes compartidos con Admin 03 extraídos a `admin/components/`.
- [x] Datos de contacto sin persistencia, sin logs y con `gcTime: 0`.
- [x] Decisiones abiertas respondidas o anotadas en el PR.
- [x] `lint`, `type-check`, `format:check` y tests en verde.
