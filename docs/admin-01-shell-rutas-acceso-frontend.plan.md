# Admin 01 — Plan de desarrollo (Shell, rutas y acceso)

> Documento de trabajo derivado de [`admin-01-shell-rutas-acceso-frontend.spec.md`](./admin-01-shell-rutas-acceso-frontend.spec.md).
> Rama: `feature/admin-frontend`.

## 1. Resumen

La historia crea el esqueleto del área ADMIN: ruta protegida `/admin/*`, redirecciones por rol, layout con sidebar, tokens visuales, tipografía y placeholders. No hay backend nuevo ni lógica de negocio. Se apoya en los patrones de `tutor/` y reutiliza `LogoutDialog`, `useLogout` y `UnderConstructionPage`.

**Estimación:** 1–1,5 días de desarrollo + verificación visual contra Figma.

## 2. Alcance

**Incluye**

- `adminPaths` y rutas `/admin/home`, `/admin/material-reports`, `/admin/session-claims`.
- `RoleRoute allowedRole="ADMIN"` y corrección de `RoleRedirect`.
- `ROLE_REDIRECT.ADMIN` en `useLogin`.
- `AdminRoutes`, `AdminLayout`, `AdminSidebar`.
- Tokens en `admin-tokens.ts` y Plus Jakarta Sans solo dentro del admin.
- Logout con confirmación reutilizando `auth/logout`.
- Placeholders con `UnderConstructionPage`.

**No incluye**

- Contenido de Home, Denuncias y Reclamos (specs 02–04).
- TopBar, badge del sidebar, campana de notificaciones, "Solicitudes de validación".
- Cambios en `theme/index.ts`, `student/` o `tutor/`.
- Cambios de backend.

## 3. Decisiones abiertas: defaults propuestos

| # | Decisión | Default propuesto |
|---|---|---|
| 1 | Badge del sidebar | No renderizar. Dejar `badge?: "materialReports" \| "sessionClaims"` opcional y sin uso en `admin-nav-items.ts`, documentado con comentario. |
| 2 | Campana US-35 | Fuera de alcance. No tocar `notification-type-config.ts`. |
| 3 | Solicitudes de validación | Fuera de alcance. |
| 4 | Copy del logout | Reutilizar `LogoutDialog` tal cual. No modificar texto compartido. |
| 5 | Saludo "Hola, Admin" | Corresponde a Admin 02, no a esta historia. |

## 4. Plan por fases

### Fase 0 — Preparación

- [x] Confirmar rama `feature/admin-frontend` y árbol limpio.
- [x] Commit inicial de los specs y este plan.
- [x] Ejecutar línea base: `npm run lint`, `npm run type-check`, `npm run test`, `npm run format:check`.

### Fase 1 — Rutas y control de acceso

**Archivos**

- `src/routes/paths.ts`
- `src/routes/AdminRoutes.tsx`
- `src/providers/RoutesProvider.tsx`
- `src/modules/auth/hooks/useLogin.ts`

**Tareas**

- [x] `adminPaths` con las 3 rutas, mismo estilo que `studentPaths`.
- [x] `AdminRoutes`: `index` → `home`, las 3 rutas con `UnderConstructionPage`, `*` → `home`.
- [x] `RoutesProvider`: ruta `/admin/*` bajo `RoleRoute allowedRole="ADMIN"`.
- [x] `RoleRedirect`: ADMIN → `/admin/home`.
- [x] `useLogin`: `ADMIN: "/admin/home"`. Opcional: tipar el mapa como `Partial<Record<AuthRole, string>>`.
- [x] No tocar las redirecciones actuales de STUDENT/TUTOR.

**Verificación**

- ADMIN en `/` → `/admin/home`.
- STUDENT/TUTOR en `/admin/home` → `/` → su home.
- ADMIN en `/student/home` → `/` → `/admin/home`.
- Sin sesión en `/admin/*` → `/auth/login`.
- `/admin/cualquier-cosa` → `/admin/home`.

### Fase 2 — Tokens y tipografía

- [x] `admin-tokens.ts` tipado (`as const`) con los valores del spec.
- [x] Constantes de `fontFamily` para contenido y sidebar.
- [x] Plus Jakarta Sans `wght@500;600;700;800` en `index.html`.
- [x] No modificar `theme/index.ts` ni la fuente global.

### Fase 3 — Navegación y sidebar

- [x] `admin-nav-items.ts` tipado, con slot de badge reservado.
- [x] `AdminSidebar` de 114 px, logo, 3 ítems, activo por `pathname` con prefijo, footer y logout.
- [x] `AdminLayout` con `Outlet`, fondo `fondo3`, `marginLeft` y Plus Jakarta Sans en la raíz.
- [x] La sidebar fuerza Inter explícitamente.

### Fase 4 — Placeholders y cierre visual

- [x] Las 3 rutas montan `UnderConstructionPage`.
- [x] Revisión en 1440×1024: ancho, colores, orden, espaciado, 2 líneas en "Reclamos de sesiones".
- [x] La fuente del admin no se filtra a student/tutor.

### Fase 5 — Tests

- [x] `test/providers/RoutesProvider.test.tsx`
- [x] `test/modules/auth/useLogin.test.tsx`
- [x] `test/modules/admin/AdminSidebar.test.tsx`

Casos detallados en la sección 7.

### Fase 6 — Verificación y PR

- [x] `npm run lint`, `npm run type-check`, `npm run format:check` (ver Fase 6), `npm run test`.
- [x] Prueba manual con ADMIN, STUDENT y TUTOR.
- [x] Sin diffs en `student/`, `tutor/` ni `theme/index.ts`.
- [ ] PR con las decisiones abiertas y el default aplicado.

## 5. Inventario de archivos

**Nuevos**

| Archivo | Responsabilidad |
|---|---|
| `src/routes/AdminRoutes.tsx` | Rutas hijas del admin y wildcard |
| `src/modules/admin/layouts/AdminLayout.tsx` | Shell visual + fuente + `Outlet` |
| `src/modules/admin/components/AdminSidebar.tsx` | Navegación, activo, logout, ancho exportado |
| `src/modules/admin/constants/admin-nav-items.ts` | Ítems tipados y slot de badge reservado |
| `src/modules/admin/styles/admin-tokens.ts` | Paleta y fuentes del admin |
| `test/providers/RoutesProvider.test.tsx` | Acceso y redirecciones |
| `test/modules/auth/useLogin.test.tsx` | Destino post-login |
| `test/modules/admin/AdminSidebar.test.tsx` | Navegación, activo y logout |

**Modificados**

| Archivo | Cambio |
|---|---|
| `src/routes/paths.ts` | `adminPaths` |
| `src/providers/RoutesProvider.tsx` | Ruta ADMIN + `RoleRedirect` |
| `src/modules/auth/hooks/useLogin.ts` | `ADMIN: "/admin/home"` |
| `index.html` | Link de Plus Jakarta Sans |

## 6. Trazabilidad Gherkin → implementación

| Escenario | Implementación | Test |
|---|---|---|
| Login de administrador | `ROLE_REDIRECT.ADMIN` | `useLogin.test` |
| Raíz con sesión admin | `RoleRedirect` | `RoutesProvider.test` |
| No-admin en `/admin/*` | `RoleRoute` | `RoutesProvider.test` |
| Admin en áreas de otros roles | `RoleRoute` + `RoleRedirect` | `RoutesProvider.test` |
| Sin sesión en `/admin/*` | `ProtectedRoute` | `RoutesProvider.test` |
| Navegación sidebar | `AdminSidebar` + `adminPaths` | `AdminSidebar.test` |
| Ítem activo en rutas hijas | `startsWith` sobre `pathname` | `AdminSidebar.test` |
| Cerrar sesión | `LogoutDialog` + `useLogout` | `AdminSidebar.test` |
| Ruta inexistente admin | `*` → `home` | `RoutesProvider.test` |

## 7. Estrategia de tests

`RoutesProvider.test.tsx`

- ADMIN en `/` → `/admin/home`.
- ADMIN en `/student/home` → `/admin/home`.
- STUDENT en `/admin/home` → `/student/home`.
- TUTOR en `/admin/home` → `/tutor/home`.
- Sin sesión en `/admin/home` → `/auth/login`.
- ADMIN en `/admin/cualquier-cosa` → `/admin/home`.

Técnica: `MemoryRouter initialEntries` + `LocationDisplay` con `useLocation` + `useAuthStore.setState()`.

`useLogin.test.tsx`

- Mock de `loginUser` con `role: "ADMIN"` → navega a `/admin/home`.
- Regresión: STUDENT y TUTOR conservan sus destinos.

`AdminSidebar.test.tsx`

- Renderiza los 3 ítems + "Salir".
- "Home" activo en `/admin/home` (`aria-current="page"`).
- "Denuncias" activo en `/admin/material-reports?selected=abc`.
- Clic en "Reclamos de sesiones" navega a `/admin/session-claims`.
- "Salir" abre "¿Cerrar sesión?".
- Confirmar invoca `triggerLogout` (mock de `useLogout`).
- Cancelar cierra el diálogo sin navegar.

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El `*` global manda a `/` y un ADMIN vuelve a student | Corregir `RoleRedirect` en la misma fase que las rutas |
| El ítem activo falla con query o rutas hijas | Comparar `pathname` con igualdad o prefijo `path + "/"` |
| La fuente del admin se filtra al resto | `fontFamily` solo en el `Box` raíz de `AdminLayout`; sidebar fuerza Inter |
| Colores hardcodeados | Usar únicamente `admin-tokens.ts` |
| Tests frágiles por bypass de auth | No definir `VITE_AUTH_BYPASS` en el entorno de test |
| Duplicar logout | Reutilizar `LogoutDialog` y `useLogout` |
| Confundir seguridad con UX | Documentar que `RoleRoute` es solo UX; el backend valida con `@PreAuthorize` |

## 9. Orden de ejecución

```
Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6
```

Las fases 1 y 2 pueden ir en paralelo; la 3 depende de ambas. La 5 se puede iniciar con los tests de rutas en cuanto termine la fase 1.

## 10. Commits sugeridos

```
docs: agrega especificaciones y plan del área administrador
feat: agrega rutas y redirecciones del rol administrador
feat: agrega tokens y tipografía del área administrador
feat: agrega sidebar y layout del área administrador
test: cubre acceso y navegación del área administrador
```

---

## 11. Resultado de la verificación (Fase 6)

| Check | Resultado |
|---|---|
| `npm run lint` | OK, sin warnings |
| `npm run type-check` | OK |
| `npm run test` | OK, 26 archivos y 144 tests |
| `npm run format:check` | Falla por CRLF preexistente (467 archivos ajenos a la historia); los archivos de esta rama pasan Prettier |
| Prueba manual ADMIN y STUDENT | OK en `npm run dev` |
| Prueba manual TUTOR | Cubierta por `RoutesProvider.test` |
| Sin cambios en `student/`, `tutor/`, `theme/index.ts` | OK |

Notas:

- El viewport disponible del browser fue 912x670; las medidas fijas (114 px de sidebar, 102x76 del ítem activo, 79 px del separador) se validaron por estilos calculados.
- "Reclamos de sesiones" mide 88.5 px de alto por el label en 2 líneas; el resto mide 76 px.
- El badge del sidebar, la campana de notificaciones y "Solicitudes de validación" quedan fuera de alcance según las decisiones abiertas.
- `RoleRoute` es solo control de UX; la autorización real sigue en el backend con `@PreAuthorize`.