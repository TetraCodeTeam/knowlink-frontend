# Admin 02 — Home / Dashboard de moderación (Frontend)

## Metadatos

| Campo | Valor |
|---|---|
| Módulo frontend | `admin/home` — nuevo |
| Rol | ADMIN |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` / `dev` |
| Ruta | `/admin/home` |
| Diseño fuente | Figma `KnowLink (Copy)`, frame `Home` `1172:796` (nodos clave: `DashboardBody` `2511:4758`, `Header - TopBar` `2512:4908`, `Rendimiento y Salud del Servicio` `2514:5686`) |
| Depende de | Admin 01 (shell). Los botones "Ir a la cola" apuntan a Admin 03 y Admin 04 |
| Backend requerido | **Endpoint de resumen no existe** (ver "Contrato propuesto") |

---

## Estado actual verificado

- No existe nada de admin en `dev` (ver Admin 01).
- El backend (`main`) no tiene endpoints de métricas ni de colas de moderación; el único endpoint de admin es `POST /api/v1/admin/bookings/{bookingId}/funds/retry`.
- Para gráficos el equipo ya usó Recharts en los artefactos de sprint, pero **esta pantalla no necesita librería de gráficos**: la "distribución" es una barra de dos segmentos hecha con `Box`.

---

## Pantalla

Desktop-first, referencia 1440×1024. Contenido a la derecha del sidebar, con padding ~40 px.

1. **TopBar** (`AdminTopBar`): tarjeta translúcida (`rgba(255,255,255,0.8)`, blur, borde inferior Celeste, radio 12).
   - Título "Hola, Admin" (Plus Jakarta Sans 700, ~40 px, letter-spacing −1 px, `#0F172A`).
   - Subtítulo "Resumen general y métricas de moderación en tiempo real" (500, ~20 px, `#64748B`).
   - Chip de fecha a la derecha con ícono de calendario: "Lunes 15 de junio, 2026" (`rgba(241,245,249,0.8)`, borde `rgba(226,232,240,0.6)`, texto `#475569` ~14 px).
2. **Dos tarjetas de cola** (`ModerationQueueCard`), mismo ancho, separación ~30 px:
   - **Reclamo de sesiones** — subtítulo "Conflictos entre tutores y alumnos". Franja superior de color: degradé `#6366F1 → #4F46E5`. Chip de ícono `#EEF2FF` (borde `#E0E7FF`).
   - **Denuncias de material** — subtítulo "Infracciones de copyright y guías indebidas". Franja superior: `#F43F5E → #F59E0B`. Chip de ícono `#FFF1F2` (borde `#FFE4E6`).
   - Cada tarjeta: aviso destacado (pill), bloque de 2 KPIs separados por línea vertical, y botón oscuro "Ir a la cola →" (`#0F172A`, texto blanco, radio ~15).
   - Pill de reclamos (índigo): "La más antigua espera hace **4 días**" (texto `#312E81`, énfasis `#4338CA`).
   - Pill de denuncias (rosa): "**1 archivo** con 6 reportes sin revisar" (énfasis `#BE123C`, resto `#4C0519`).
   - KPIs: "Resueltas esta semana" → número grande (ExtraBold ~30 px) + delta verde (`#059669`, "+12%"); "Nuevas esta semana" → número + "pendientes" en `#94A3B8`.
3. **Panel "Rendimiento y Salud del Servicio"** (`PerformancePanel`): título (700, ~20 px), subtítulo "Eficiencia operativa y tiempos de respuesta", y a la derecha un toggle segmentado **"Esta semana" | "30 días"** (activo: fondo blanco sobre contenedor `rgba(241,245,249,0.8)`).
   - `MetricTile` "Tiempo promedio (TTR)": "3.8h" + "+18% más rápido" (verde).
   - `MetricTile` "Tareas sin resolver": "8.2%" + "Bajo control" (verde).
   - `VolumeDistributionBar` "Distribución de volumen operativo" (“Total: 100%”): barra de 10 px de alto con segmento índigo `#4F46E5` (Reclamos de sesiones, 58%) y rosa `#F43F5E` (Denuncias de material, 42%), leyenda con punto de color + nombre + porcentaje en negrita.

---

## Contrato de datos (PROPUESTO — confirmar con backend, no existe en `main`)

`GET /api/v1/admin/dashboard/summary?range=WEEK|MONTH` (`@PreAuthorize("hasRole('ADMIN')")`)

```ts
// modules/admin/home/interfaces/types: un archivo por tipo
export type DashboardRange = "WEEK" | "MONTH";

export interface QueueSummary {
  resolvedThisWeek: number;
  resolvedDeltaPct: number | null; // vs. semana anterior; null si no hay base de comparación
  newThisWeek: number;
}

export interface SessionClaimsQueueSummary extends QueueSummary {
  oldestPendingDays: number | null; // null si no hay pendientes
}

export interface MaterialReportsQueueSummary extends QueueSummary {
  pendingFiles: number;
  pendingReports: number;
}

export interface PerformanceSummary {
  avgResolutionHours: number | null;
  avgResolutionDeltaPct: number | null; // positivo = más rápido que el período anterior
  unresolvedPct: number;                // 0–100
  volumeSplit: { claimsPct: number; reportsPct: number }; // suman 100
}

export interface DashboardSummaryResponse {
  sessionClaims: SessionClaimsQueueSummary;
  materialReports: MaterialReportsQueueSummary;
  performance: PerformanceSummary;
}
```

Regla de `docs/base-standards.md`: estos tipos deben **seguir al DTO real del backend**. Si el backend los nombra distinto, el frontend se ajusta, no al revés.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Home del administrador

  Scenario: Carga inicial
    Given un ADMIN autenticado
    When abre "/admin/home"
    Then ve el saludo "Hola, Admin", el subtítulo y la fecha de hoy en español
    And ve las tarjetas "Reclamo de sesiones" y "Denuncias de material"
    And ve el panel "Rendimiento y Salud del Servicio" con "Esta semana" seleccionado

  Scenario: Fecha formateada
    Given que hoy es lunes 15 de junio de 2026
    Then el chip de fecha muestra "Lunes 15 de junio, 2026"

  Scenario: Aviso de reclamo más antiguo
    Given reclamos pendientes con el más antiguo de 4 días
    Then el pill muestra "La más antigua espera hace 4 días"
    And con 1 día muestra "hace 1 día"

  Scenario: Sin reclamos pendientes
    Given oldestPendingDays es null
    Then el pill muestra "No hay reclamos pendientes"

  Scenario: Aviso de denuncias sin revisar
    Given 1 archivo con 6 reportes pendientes
    Then el pill muestra "1 archivo con 6 reportes sin revisar"
    And con 2 archivos y 1 reporte cada uno usa plurales correctos ("2 archivos con 2 reportes")

  Scenario: Sin denuncias pendientes
    Given pendingFiles es 0
    Then el pill muestra "No hay denuncias sin revisar"

  Scenario: Ir a la cola
    When hace clic en "Ir a la cola" de Reclamo de sesiones
    Then navega a "/admin/session-claims"
    When hace clic en "Ir a la cola" de Denuncias de material
    Then navega a "/admin/material-reports"

  Scenario: Cambio de rango
    When selecciona "30 días"
    Then se solicita el resumen con range=MONTH
    And solo se actualiza el panel de rendimiento

  Scenario: Delta de TTR
    Given avgResolutionDeltaPct = 18
    Then muestra "+18% más rápido"
    Given avgResolutionDeltaPct = -10
    Then muestra "10% más lento" con color de advertencia
    Given avgResolutionDeltaPct es null
    Then no muestra delta

  Scenario: Error de carga
    Given que el endpoint falla
    Then se muestra un estado de error con botón "Reintentar"
    And el saludo, la fecha y el sidebar siguen visibles
```

---

## Estructura de archivos

```
src/modules/admin/home/
├── api/admin-home.api.ts                  # getDashboardSummary(range)  (un solo archivo por módulo)
├── hooks/useDashboardSummary.ts           # useQuery, key ["admin","dashboard","summary", range]
├── interfaces/
│   ├── responses/dashboard-summary.response.ts
│   └── types/dashboard-range.type.ts      # o en modules/admin/types/
├── components/
│   ├── AdminTopBar.tsx
│   ├── ModerationQueueCard.tsx            # prop variant: "claims" | "reports"
│   ├── QueueKpiPair.tsx
│   ├── PerformancePanel.tsx
│   ├── RangeToggle.tsx
│   ├── MetricTile.tsx
│   ├── VolumeDistributionBar.tsx
│   └── DashboardSkeleton.tsx
├── constants/queue-card-config.ts         # textos, colores y destino por variante
├── utils/format-admin-date.ts             # Intl es-AR, primera letra en mayúscula
├── utils/pluralize.ts                     # día/días, archivo/archivos, reporte/reportes
├── styles/admin-home.styles.ts            # SxProps<Theme>
└── pages/AdminHomePage.tsx
```

Las query keys del módulo admin se centralizan en `modules/admin/constants/admin-query-keys.ts` (el equipo ya tuvo desalineaciones de claves de invalidación en React Query; ver US-06): `adminQueryKeys.dashboard(range)`, y las de Admin 03/04 en el mismo archivo.

## Reglas de implementación

- `AdminHomePage` solo compone; los componentes no llaman a axios.
- Un único `useQuery` para las dos tarjetas y el panel; el cambio de rango **no** debe borrar las tarjetas: usar `placeholderData: keepPreviousData` y que `range` solo afecte `performance`.
- Mantener "tiempo real" razonable: `refetchInterval: 60_000` y `refetchOnWindowFocus: true` (decisión editable en una constante).
- Fecha calculada en cliente con `Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })`, capitalizando la primera letra y respetando el formato "Lunes 15 de junio, 2026" (la coma antes del año se arma a mano si `Intl` no la produce).
- Botones con `AppButton` (agregar variante `dark` en `shared/styles/buttonSx.ts` si hace falta; no `sx` de color en el módulo).
- Íconos con `lucide-react`. Los de las tarjetas (reloj/gráfico circular, triángulo de alerta, calendario, flecha) se eligen del set lucide más cercano al SVG de Figma.
- Colores de delta: positivo `#059669`; negativo propuesto `#BE123C` (el diseño no define el caso negativo).
- Responsive propuesto (el diseño solo cubre 1440): ≥1100 px dos columnas; <1100 px las tarjetas se apilan.

---

## Decisiones abiertas

1. **Semántica de "esta semana".** Las dos tarjetas dicen "esta semana" fijo mientras el panel tiene toggle "Esta semana / 30 días". Se asume que el toggle afecta **solo** el panel de rendimiento.
2. **Base del delta** ("+12%", "+8%", "+18% más rápido"): se asume contra el período anterior equivalente. Confirmar con backend.
3. **"Bajo control".** No se sabe a partir de qué porcentaje de "Tareas sin resolver" cambia la etiqueta ni su color. Propuesta hasta definir: `Bajo control` (verde) si `unresolvedPct < 15`, `Atención` (ámbar) hasta 30, `Crítico` (rosa) desde 30. **Umbrales provisionales.**
4. **Copy "Nuevas esta semana 9 pendientes".** Mezcla "nuevas" con "pendientes". Se implementa tal cual el diseño; si "pendientes" es el total actual de la cola y no las nuevas, ajustar rótulo.
5. **Datos duplicados en el mock.** Ambas tarjetas muestran "11 resueltas / 9 nuevas": es placeholder. No usar esos números en tests como si fueran reglas.
6. **Variante de Home en el frame `Logout`.** Contiene "Últimas resoluciones" y "Solicitudes de validación", ausentes en el frame `Home`. No se implementa; confirmar si es una versión anterior descartada.
7. **Saludo con nombre real** (ver Admin 01).

## No hacer

- No usar `useEffect` + `useState` + axios para los datos.
- No agregar Recharts ni otra librería de gráficos.
- No inventar métricas que el diseño no muestra (ej. satisfacción, NPS).
- No hardcodear los números del mock (11, 9, 3.8h, 8.2%, 58/42) en el componente.
- No usar `style={{}}` inline ni colores fuera de `admin-tokens.ts`.
- No modificar el tema global ni `shared/components` salvo agregar la variante de botón.
- No implementar "Solicitudes de validación" ni "Últimas resoluciones".

## Tests

- `formatAdminDate` (días y meses, mayúscula inicial).
- `pluralize` y los textos de los pills (1/2+, 0, null).
- `ModerationQueueCard`: ambas variantes, navegación del CTA, estados nulos.
- `PerformancePanel`: toggle dispara `range=MONTH`, delta positivo/negativo/null, etiqueta de "Tareas sin resolver" según umbral.
- `VolumeDistributionBar`: anchos proporcionales y suma 100.
- `AdminHomePage`: loading (skeleton), error con reintento, éxito.

## Definition of Done

- [ ] Pantalla fiel a Figma (`1172:796`) a 1440 px: tipografías, colores, radios y sombras de los tokens
- [ ] Contrato de datos confirmado con backend y tipos alineados al DTO
- [ ] Estados loading / error / vacío implementados
- [ ] "Ir a la cola" navega a las rutas de Admin 03 y 04
- [ ] Query keys centralizadas en `admin-query-keys.ts`
- [ ] `lint` sin warnings, `type-check`, `format:check` y tests en verde
- [ ] Decisiones abiertas respondidas o anotadas en el PR
