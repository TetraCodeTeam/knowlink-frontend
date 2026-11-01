# Admin 01 — Shell, rutas y control de acceso del rol ADMIN (Frontend)

## Metadatos

| Campo | Valor |
|---|---|
| Módulo frontend | `admin` (shell) — nuevo |
| Rol | ADMIN |
| Repo / rama base | `TetraCodeTeam/knowlink-frontend` / `dev` |
| Diseño fuente | Figma `KnowLink (Copy)` — sección "Administrador" (`node-id=29-609`): `sidebar` `1250:2562`, `Home` `1172:796`, `Logout` `1256:3719` |
| Bloquea a | Admin 02 (Home), Admin 03 (Denuncias de material), Admin 04 (Reclamos de sesiones) |
| Backend requerido | Ninguno nuevo. Solo que el login devuelva `role: "ADMIN"` (ya contemplado en `AuthRole`) |

Este documento es el **primero** de la serie: sin él no existe ruta ni layout donde montar los otros tres.

---

## Estado actual verificado en `dev`

- `src/shared/types/role.type.ts` ya define `AUTH_ROLE_VALUES = ["TUTOR", "STUDENT", "ADMIN"]` y el tipo `AuthRole`.
- `src/providers/RoutesProvider.tsx`: `RoleRoute` solo se usa con `STUDENT` y `TUTOR`. **No hay ruta `/admin/*`.**
- `RoleRedirect` (mismo archivo) envía a `/tutor/home` si el rol es TUTOR y a `/student/home` en cualquier otro caso → **un ADMIN autenticado que entra a `/` hoy aterriza en el área de alumno.**
- `src/modules/auth/hooks/useLogin.ts` usa `ROLE_REDIRECT[authResponse.role] ?? "/student/home"`: sin entrada `ADMIN`, el login de un admin también cae en `/student/home`.
- `src/routes/paths.ts` solo exporta `studentPaths`.
- Patrón a imitar: `TutorRoutes.tsx` + `TutorLayout.tsx` + `TutorSidebar` (exporta una constante de ancho, `TUTOR_SIDEBAR_WIDTH`).
- Reutilizable: `auth/logout` (`LogoutDialog`, `useLogout`), `shared/components/AppButton`, `AppConfirmDialog`, `EmptyState`.
- Tipografía: `index.html` carga **Inter** (400–800). **Plus Jakarta Sans no está cargada** y el diseño del admin la usa para todo el contenido.
- Tema MUI global (`src/theme/index.ts`): solo define `primary` (`#5B6ED9`). No se toca en esta historia.
- Backend (`main`): el único endpoint de admin hoy es `POST /api/v1/admin/bookings/{bookingId}/funds/retry` con `@PreAuthorize("hasRole('ADMIN')")`.

---

## Alcance

**Incluye**
1. Ruta protegida `/admin/*` con `RoleRoute allowedRole="ADMIN"`.
2. Corrección de `RoleRedirect` y de `ROLE_REDIRECT` (login) para ADMIN.
3. `AdminRoutes`, `AdminLayout`, `AdminSidebar`.
4. Flujo de "Salir" con diálogo de confirmación (reutiliza `auth/logout`).
5. Tokens de diseño del admin y carga de Plus Jakarta Sans.
6. `adminPaths` en `routes/paths.ts`.
7. Páginas placeholder (`UnderConstructionPage`) para las 3 rutas hasta que existan Admin 02/03/04.

**No incluye**: contenido de Home, Denuncias ni Reclamos (specs 02–04); campana de notificaciones (ver "Decisiones abiertas").

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Acceso y navegación del rol ADMIN

  Scenario: Login de un administrador
    Given un usuario con rol ADMIN
    When inicia sesión correctamente
    Then es redirigido a "/admin/home"

  Scenario: Raíz con sesión de administrador
    Given un ADMIN autenticado
    When navega a "/"
    Then es redirigido a "/admin/home"
    And nunca a "/student/home"

  Scenario: Un no-admin intenta entrar al área admin
    Given un usuario autenticado con rol STUDENT o TUTOR
    When navega a "/admin/home"
    Then es redirigido a "/"

  Scenario: Un admin intenta entrar a áreas de otros roles
    Given un ADMIN autenticado
    When navega a "/student/home" o "/tutor/home"
    Then es redirigido a "/"
    And desde "/" termina en "/admin/home"

  Scenario: Usuario sin sesión
    Given un usuario no autenticado
    When navega a cualquier ruta "/admin/*"
    Then es redirigido a "/auth/login"

  Scenario: Navegación por la barra lateral
    Given un ADMIN en cualquier pantalla del área admin
    When hace clic en "Home", "Denuncias" o "Reclamos de sesiones"
    Then navega a "/admin/home", "/admin/material-reports" o "/admin/session-claims" respectivamente
    And el ítem de la ruta actual queda resaltado

  Scenario: Ítem activo en rutas hijas
    Given un ADMIN en "/admin/material-reports?selected=abc"
    Then el ítem "Denuncias" sigue resaltado

  Scenario: Cerrar sesión
    Given un ADMIN en cualquier pantalla del área admin
    When hace clic en "Salir"
    Then se abre el diálogo "¿Cerrar sesión?"
    When confirma
    Then se cierra la sesión y es redirigido a "/auth/login"
    When cancela
    Then el diálogo se cierra y permanece en la pantalla actual

  Scenario: Ruta inexistente dentro del área admin
    Given un ADMIN
    When navega a "/admin/cualquier-cosa"
    Then es redirigido a "/admin/home"
```

---

## Diseño a implementar

### Layout
- `AdminLayout`: `Box` flex, `minHeight: 100vh`, fondo `Fondo3 #F4F3FB` (relleno de `Home`), sidebar fija a la izquierda y `main` con `marginLeft: ADMIN_SIDEBAR_WIDTH` y `minWidth: 0`, igual que `TutorLayout`.
- Sidebar de **114 px** de ancho, alto completo (1024 en el frame), fondo `#181B34`.

### Sidebar (`AdminSidebar`)
| Elemento | Especificación (Figma) |
|---|---|
| Logo | Ícono `GraduationCap` de 38 px centrado (top 20) + texto "KnowLink", 16 px, semibold, color Celeste `#C7C8FF` |
| Ítems | Ícono 40 px + etiqueta centrada, Inter 15 px, color `#F4F3FB`, ancho 110 px, máx. 2 líneas ("Reclamos de sesiones" ocupa 2) |
| Íconos (lucide-react) | Home → `House`; Denuncias → `BookAlert`; Reclamos de sesiones → `Scale` |
| Ítem activo | Fondo `rgba(199,200,255,0.34)`, radio 8 px, bloque de ~102×76 px |
| Pie | Línea separadora (79 px de ancho) + ícono `LogOut` de 24 px + "Salir" en Inter 20 px, color `#F4F3FB` |
| Orden | Home, Denuncias, Reclamos de sesiones, (espacio flexible), Salir |
| Badge numérico | Aparece sobre el ícono de Denuncias y de Reclamos en las pantallas de listado (círculo pequeño con número). **Semántica sin definir, ver "Decisiones abiertas"** |

### Tokens (`modules/admin/styles/admin-tokens.ts`)
Constantes tipadas, no se modifica `theme/index.ts`.

| Token | Valor | Uso |
|---|---|---|
| `celeste` | `#C7C8FF` | Logo, bordes de TopBar |
| `fondo1` | `#E6E4F2` | Variable del diseño (fondo alternativo) |
| `fondo3` | `#F4F3FB` | Fondo de página, texto del sidebar |
| `sidebarBg` | `#181B34` | Sidebar |
| `ink` | `#0F172A` | Títulos, botón principal oscuro |
| `slate500` / `slate600` | `#64748B` / `#475569` | Texto secundario |
| `slate400` | `#94A3B8` | Texto terciario |
| `indigo600` / `indigo500` | `#4F46E5` / `#6366F1` | Acción principal, reclamos |
| `rose500` | `#F43F5E` | Denuncias |
| `emerald600` | `#059669` | Deltas positivos |
| Fuente contenido | Plus Jakarta Sans 500/600/700/800 | Todo salvo sidebar |
| Fuente sidebar | Inter 15 / 20 | Estilos `S2` / `S1` del diseño |

Cargar Plus Jakarta Sans en `index.html` junto a Inter (`wght@500;600;700;800`) y aplicarla **solo** dentro de `AdminLayout` (`fontFamily` en el `Box` raíz), sin cambiar la fuente global.

---

## Estructura de archivos

```
src/
├── routes/
│   ├── AdminRoutes.tsx                 # index→home, home, material-reports, session-claims, * → home
│   └── paths.ts                        # + adminPaths
├── providers/RoutesProvider.tsx        # + <RoleRoute allowedRole="ADMIN"/> → /admin/*; RoleRedirect con ADMIN
├── modules/auth/hooks/useLogin.ts      # ROLE_REDIRECT.ADMIN = "/admin/home"
└── modules/admin/
    ├── layouts/AdminLayout.tsx
    ├── components/AdminSidebar.tsx     # exporta ADMIN_SIDEBAR_WIDTH = 114
    ├── constants/admin-nav-items.ts    # { label, path, icon } tipado
    ├── styles/admin-tokens.ts
    └── (home|material-reports|session-claims)/   # specs 02, 03, 04
```

`adminPaths` (siguiendo el estilo de `studentPaths`):

```ts
export const adminPaths = {
  home: "/admin/home",
  materialReports: "/admin/material-reports",
  sessionClaims: "/admin/session-claims",
};
```

Cambios puntuales en archivos existentes:
- `RoutesProvider.tsx`: agregar `<Route element={<RoleRoute allowedRole="ADMIN" />}><Route path="/admin/*" element={<AdminRoutes />} /></Route>` y en `RoleRedirect` devolver `/admin/home` para `ADMIN`.
- `useLogin.ts`: agregar `ADMIN: "/admin/home"` al mapa `ROLE_REDIRECT`.
- `index.html`: link de Plus Jakarta Sans.

---

## Decisiones abiertas (confirmar con el equipo antes de implementar)

1. **Badge numérico del sidebar.** En el diseño muestra "1" en Denuncias y en Reclamos, mientras la pestaña "Pendiente" de cada listado muestra 5. No se sabe si es "asignadas a mí", "pendientes" u otra cosa. Hasta definirlo, **no implementar el badge**; dejar el slot preparado en `admin-nav-items.ts`.
2. **Campana de notificaciones (US-35).** El diseño del admin no la incluye. El spec de US-35 anticipaba montarla en el layout de admin; se pospone. Cuando se decida, solo hay que agregar las rutas de `ADMIN_MATERIAL_REPORT_RECEIVED` (→ `/admin/material-reports`) y `ADMIN_VALIDATION_REQUEST_PENDING` en `notification-type-config.ts`.
3. **"Solicitudes de validación".** Aparece en una variante de Home dentro del frame `Logout` (`1256:3719`) pero no hay pantalla ni ítem de menú para ese módulo. **Fuera de alcance**; el tipo de notificación `ADMIN_VALIDATION_REQUEST_PENDING` queda sin destino.
4. **Copy del diálogo de logout.** Figma dice "Vas a tener que volver a iniciar sesión para acceder a tu cuenta."; el `LogoutDialog` actual dice "Vas a tener que iniciar sesión nuevamente…". Se reutiliza el componente tal cual (no se cambia copy compartido) salvo que el equipo pida unificarlo.
5. **Saludo.** El diseño muestra "Hola, Admin" literal. Si el store de auth trae nombre, se podría personalizar; por defecto se mantiene el texto del diseño.

---

## No hacer

- No crear ni modificar rutas, layouts o componentes de `student/` o `tutor/`.
- No cambiar `theme/index.ts` ni la fuente global; los tokens del admin viven en `admin/styles/`.
- No duplicar `LogoutDialog` ni `useLogout`: reutilizarlos.
- No usar `style={{}}` inline ni colores hardcodeados fuera de `admin-tokens.ts`.
- No agregar el badge del sidebar ni la campana de notificaciones (ver decisiones abiertas).
- No agregar pantallas de "Solicitudes de validación".
- No confiar solo en el frontend para la seguridad: el control real es `@PreAuthorize('ADMIN')` del backend; el `RoleRoute` es solo UX.
- No usar `any`.

---

## Tests (Vitest + Testing Library)

- `RoutesProvider`: ADMIN en `/` → `/admin/home`; STUDENT/TUTOR en `/admin/home` → `/`; ADMIN en `/student/home` → `/`; sin sesión → `/auth/login`.
- `useLogin`: rol `ADMIN` navega a `/admin/home`.
- `AdminSidebar`: renderiza los 3 ítems + Salir; resalta el activo por ruta (incluida ruta hija); clic navega; "Salir" abre `LogoutDialog`; confirmar llama a `useLogout`.

## Definition of Done

- [ ] `npm run lint` sin warnings, `npm run type-check`, `npm run format:check` y `npm run test` en verde
- [ ] Login de ADMIN, `/` y `/admin/*` se comportan como en los escenarios
- [ ] `AdminSidebar` fiel a Figma (ancho, colores, íconos, ítem activo, "Salir")
- [ ] Plus Jakarta Sans cargada y aplicada solo dentro de `AdminLayout`
- [ ] Rutas placeholder para Home, Denuncias y Reclamos
- [ ] Sin cambios en módulos `student/` y `tutor/`
- [ ] Decisiones abiertas respondidas o documentadas en el PR
