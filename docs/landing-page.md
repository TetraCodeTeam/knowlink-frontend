# Landing page (`modules/landing`)

Página pública de presentación de KnowLink, en la ruta `/`. Quien ya tiene sesión es redirigido a su panel
(`/student/home` o `/tutor/home`); los visitantes ven la landing. Las rutas protegidas siguen mandando a
`/auth/login`.

## Estructura

```
modules/landing/
├── assets/        frankie.webp (ilustración oficial) y beta-qr.svg (formulario de beta testers)
├── components/    una sección por archivo (Hero, DualRole, HowItWorks, Features, Community, Explain, FinalCta)
│                  y los diálogos (AboutFrankieDialog, GuestPromptDialog)
├── constants/     enlaces, textos de los avisos para invitados y el contenido de ejemplo de la comunidad
├── hooks/         useHeroReveal (entrada de Frankie), useLivingWhale (canvas), useInView, useGuestGate
├── pages/         LandingPage
└── styles/        landing-tokens.css (variables --kl-*) y CSS Modules por zona (hero / sections)
```

Las tipografías (Instrument Serif, Manrope, JetBrains Mono) se cargan desde `index.html`. Los estilos son CSS
Modules porque la landing usa animaciones, `mix-blend-mode` y `@keyframes` que no se expresan bien con `sx`.

## Frankie

- **Hero**: la ilustración nada hasta su lugar (Web Animations API) y, una vez en su sitio, `useLivingWhale`
  la "anima" re-muestreando la imagen en un canvas (cola, olas y parpadeo). Respeta `prefers-reduced-motion`,
  se pausa fuera de pantalla y, si algo falla, queda la imagen estática.
- **Cara en los globos**: `FrankieFace` recorta la misma imagen con CSS (sin canvas).

## Comunidad en modo invitado

La sección "Comunidad" reutiliza los componentes reales (`PostCard`, `PostComposerCard`, `AuthorAvatar`,
`CommunityEmptyState`) con contenido **ficticio** (`constants/demo-community.ts`): la landing es pública y la
comunidad real solo se ve con sesión, así que no consulta al backend.

- `PostCard` y `FeaturedReplyPreview` aceptan `onGuestAction` / `onGuestBooking`. Con ellos, abrir el hilo,
  responder, marcar como útil o reservar llaman al manejador en vez de navegar o mutar.
- `GuestGateProvider` expone `useGuestGate().requireAuth(accion)` y abre `GuestPromptDialog`: Frankie explica
  qué acción necesita cuenta y ofrece **Crear mi cuenta**, **Ya tengo cuenta** o **Seguir mirando**. Los textos
  por acción están en `constants/guest-actions.constants.ts`.
- Un invitado puede mirar y filtrar (tipo y materia) las publicaciones de ejemplo; no puede publicar,
  responder, reaccionar ni reservar.

## Contenido

Cada cifra y regla que afirma la landing se verificó contra el backend: turno retenido 15 minutos
(`BookingConstants.HOLD_MINUTES`), clases de 1 a 3 horas, código de 4 dígitos para confirmar la sesión,
calificación a ciegas dentro de las 24 h, reclamos dentro de las 24 h, fondos retenidos hasta confirmar la
sesión y material desbloqueado por sesión completada. Si cambia alguna de esas reglas, hay que actualizar los
textos de `HowItWorksSection`, `FeaturesSection` y `ExplainSection`.
