# Spec Frontend — Catálogo multi-institución (Institución / Carrera / Materia)

## Metadata

- **Feature ID:** FEAT-CATALOGO-INSTITUCIONAL
- **Historias relacionadas:** US-01, US-06, US-42, US-43
- **Repo:** `knowlink-frontend`
- **Rama sugerida:** `feat/catalogo-institucional`
- **Depende de:** spec de backend `FEAT-CATALOGO-INSTITUCIONAL` (endpoints de `/api/catalogo/*` deben existir antes de integrar)

## Contexto para el agente

El registro de alumno (US-01) y de tutor (US-42) pasan a requerir selección de **institución** antes de carrera, y el selector de carrera queda filtrado dinámicamente según la institución elegida. El selector de materias (en el registro de tutor) combina las materias de la carrera elegida con las materias asociadas a la carrera reservada "Materias Compartidas" de esa misma institución — esto lo resuelve el backend, el frontend solo consume la lista ya combinada de `GET /api/catalogo/materias?institucionId=&carreraId=`.

La búsqueda (US-06) se filtra por institución del usuario autenticado **de forma automática y silenciosa** — no es un filtro que el usuario controle ni ve en el UI, se resuelve server-side. No agregar ningún selector de institución al buscador.

---

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Selección de institución en el registro

  Scenario: El selector de carrera está deshabilitado hasta elegir institución
    Given el visitante abre el formulario de registro de alumno
    Then el selector de carrera aparece deshabilitado
    And muestra el texto de ayuda "Elegí tu institución primero"

  Scenario: Cambiar la institución resetea la carrera seleccionada
    Given el visitante seleccionó la institución "UTN FRVM" y la carrera "Ingeniería en Sistemas"
    When cambia la institución a "UNVM"
    Then la carrera seleccionada se limpia
    And el selector de carrera se recarga con las carreras de "UNVM"

  Scenario: Registro de tutor combina materias de carrera y materias compartidas
    Given el visitante (tutor) seleccionó institución "UTN FRVM" y carrera "Ingeniería en Sistemas"
    When abre el selector de materias
    Then ve tanto las materias propias de "Ingeniería en Sistemas" como las materias compartidas de "UTN FRVM"
    And no ve materias de otras instituciones

  Scenario: Error de materia duplicada en la gestión de catálogo (admin)
    Given el administrador intenta crear una materia con un nombre ya existente en esa institución
    When el backend responde 409 con "materiaExistenteId"
    Then el frontend no muestra un error genérico
    And ofrece un enlace directo a "Editar asociaciones de [nombre de la materia existente]"
```

---

## Stack confirmado

React 19 + TypeScript + Vite 6, TanStack Query v5, Zustand v5, MUI v7, Tailwind v4, react-hook-form + zod, Axios.

---

## Placement de archivos (nuevo módulo `catalog`)

```
src/modules/catalog/                  # Módulo nuevo
├── api/
│   ├── institucionesApi.ts           # getInstituciones
│   ├── carrerasApi.ts                # getCarrerasByInstitucion
│   └── materiasApi.ts                # getMaterias, createMateria, updateMateriaCarreras
├── hooks/
│   ├── useInstituciones.ts           # React Query — lista de instituciones (staleTime alto, cambia poco)
│   ├── useCarrerasByInstitucion.ts   # React Query — enabled: !!institucionId
│   └── useMateriasByCarrera.ts       # React Query — enabled: !!institucionId && !!carreraId
├── interfaces/
│   ├── Institucion.ts
│   ├── Carrera.ts                    # incluye tipo: 'REGULAR' | 'COMPARTIDA'
│   └── Materia.ts
└── schemas/
    └── materiaSchema.ts              # zod, para el formulario admin de alta de materia
```

### Archivos existentes a modificar

- `src/modules/auth/schemas/` — el schema zod de registro de alumno y de tutor (US-01, US-42): agregar `institucionId` (requerido) y actualizar la validación de `carreraId`/`materiaIds` para que dependan de la institución elegida.
- `src/modules/auth/components/` (o `pages/`, según dónde viva hoy el formulario de registro) — agregar el `Select` de institución como primer campo del formulario, antes de carrera. Usar `useCarrerasByInstitucion(institucionId)` con `enabled` condicionado a que haya institución elegida, y resetear el campo `carreraId` del formulario (`setValue` / `resetField` de react-hook-form) cada vez que cambia `institucionId`.
- El hook existente que ya resuelve materias disponibles en el registro de tutor (mencionado en sesiones previas como parte del flujo de materias duplicadas) — reemplazar su fuente de datos por `useMateriasByCarrera`, que ya devuelve la lista combinada (carrera + compartidas) resuelta por el backend.
- Lo que haya implementado para búsqueda (US-06) — **no requiere cambio de UI**, pero confirmar que el cliente HTTP no está mandando ningún parámetro de institución manualmente; el filtrado es responsabilidad exclusiva del backend a partir del usuario autenticado.

### Pantalla de administración de catálogo (US-43)

Si ya existe una pantalla de administración de materias/carreras, extenderla; si no existe aún, crearla en `src/modules/catalog/pages/AdminCatalogoPage.tsx` con:
- Selector de institución activa (para filtrar qué carreras/materias se están viendo/editando)
- Listado de carreras de esa institución, con la carrera `COMPARTIDA` mostrada pero sin acciones de editar/eliminar sobre ella
- Formulario de alta de materia con multi-select de carreras (incluye "Materias Compartidas" como opción más)
- Manejo del 409 de materia duplicada: mostrar el mensaje del backend y un botón "Editar asociaciones" que navega al formulario de edición de la materia existente (`materiaExistenteId`), en vez de un toast de error genérico

---

## No hacer

- No agregar un selector de institución al buscador (US-06) — el filtrado es automático y no debe ser visible ni configurable por el usuario.
- No permitir seleccionar la carrera "Materias Compartidas" como una opción de carrera "normal" en el registro de alumno/tutor — solo debe poder asociarse a materias desde la pantalla de administración de catálogo.
- No cachear la lista de carreras de una institución bajo una key de React Query que no incluya el `institucionId` — evita datos cruzados entre instituciones al navegar entre selects.
- No construir el combo de materias en el cliente combinando dos llamadas (una a materias de carrera y otra a materias compartidas) — el backend ya devuelve la lista combinada en un solo endpoint; hacerlo en el cliente duplica lógica que ya resolvió el backend.
- No mostrar el campo `tipo` de Carrera como texto plano tipo "COMPARTIDA" en el UI del alumno/tutor — es un detalle interno; en el registro no debería ni aparecer como opción, y en el admin se puede mostrar como una etiqueta tipo "Transversal" en vez del nombre técnico del enum.

## Definition of Done

- [ ] Módulo `catalog` creado con api/hooks/interfaces según el placement de arriba
- [ ] Formulario de registro de alumno (US-01) con selector de institución → carrera en cascada, con reset de carrera al cambiar institución
- [ ] Formulario de registro de tutor (US-42) con el mismo agregado, más selector de materias consumiendo la lista combinada del backend
- [ ] Manejo del error 409 de materia duplicada en la pantalla de administración de catálogo
- [ ] Tests con Vitest + Testing Library de los nuevos hooks (`useInstituciones`, `useCarrerasByInstitucion`, `useMateriasByCarrera`) y del comportamiento de reset en cascada del formulario
- [ ] `npm run type-check` y `npm run lint` sin errores
- [ ] Verificación manual de que el buscador (US-06) no expone ningún control de institución en el UI
