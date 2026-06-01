# Misión — EjeClick Multi-Tenant SaaS

## 1. Product Vision
Crear la **plataforma SaaS líder para barberías en Latinoamérica**. Una sola instancia, múltiples barberías. Cada barbería tiene su propio subdominio, landing page personalizada con colores y branding propio, panel administrativo completo para manejar servicios, citas, galería y disponibilidad.

**On-boarding de una nueva barbería en menos de 5 minutos:**
1. Super admin crea el registro (slug, nombre)
2. El sistema auto-provee schedule, sections, admin user, servicios base
3. El dueño de la barbería personaliza colores, logo y contenido
4. La landing está lista en su subdominio sin escribir una línea de código

## 2. Scrum Roles

- **Product Owner**: Fundador de EjeClick (define backlog, prioriza funcionalidades para todas las barberías)
- **Super Admin**: Administrador global que crea, gestiona y accede a cualquier barbería sin restricción
- **Admin (dueño de barbería)**: Configura su barbería desde el panel admin (servicios, horarios, branding)
- **Barbero**: Gestiona disponibilidad, citas y su perfil desde el panel admin
- **Scrum Master & Development**: IA Agente responsable de implementar con Clean Code, tenant isolation y validación completa

## 3. Arquitectura Frontend

Atomic Design con multi-tenancy:

- **Atoms**: Componentes reutilizables sin lógica de negocio (Button, Input, Badge, Calendar)
- **Molecules**: Compuestos de átomos con estado local (ServiceCard, TestimonialCard, GalleryImage)
- **Organisms**: Secciones completas que reciben datos del tenant (Hero, Services, Gallery, BookingWidget, AdminLayout)
- **Templates**: Layouts que posicionan organisms, reciben tenant config
- **Pages**: LandingPage y AdminPanel, ambas renderizadas con datos del tenant activo

Cada componente usa CSS custom properties (`var(--brand-primary)`) heredadas del tenant, no colores hardcodeados.

## 4. Definition of Done (DoD)

1. Implementado siguiendo Atomic Design + tenant isolation
2. TypeScript: 0 errores. Build: exitoso. Tests: pasan todos.
3. Responsible en 375px, 768px, 1440px
4. WCAG AA: contraste, labels, roles ARIA, skip-link
5. Tenant isolation verificado: un tenant NUNCA puede acceder a datos de otro
6. Sin hardcode: colores, textos, contenido → todo desde BD
7. Documentado en ADR si es decisión arquitectónica
8. Backlog actualizado en task.md
