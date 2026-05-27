# Misión del Proyecto EjeClick (Metodología Scrum & Atomic Design)

## 1. Product Vision (Visión del Producto)
Posicionar a **EjeClick** como quien lleva tecnología real a pequeñas empresas para que vendan y envíen en automático. Proveer una **Landing Page de conversión masiva** que funcione como el principal vendedor 24/7, diseñada con velocidad enterprise (Performance >95, animaciones fluidas, 3D interactivo, Dark Premium). Sin tecnicismos, sin promesas falsas, solo herramientas que funcionan.

## 2. Scrum Roles
*   **Product Owner**: El usuario / fundador de EjeClick (prioriza el backlog y define los requerimientos de negocio y diseño).
*   **Scrum Master & Development Team**: El Agente de IA (Antigravity), responsable de asegurar el cumplimiento técnico, el código bajo Atomic Design, la accesibilidad (WCAG) y entregar el incremento de valor funcional en cada iteración.

## 3. Arquitectura Frontend (Atomic Design)
Para asegurar escalabilidad, mantenibilidad y modularidad extrema, el proyecto React se construirá estrictamente bajo la metodología **Atomic Design**:
*   **Atoms (Átomos)**: Elementos UI indivisibles (Botones, Inputs, Tipografía, Íconos, Orbes CSS).
*   **Molecules (Moléculas)**: Grupos simples de átomos funcionando juntos (Campos de formulario con su label, Cards de métricas).
*   **Organisms (Organismos)**: Secciones complejas y autónomas (Navbar, Footer, Hero 3D, Bento Grid de Servicios).
*   **Templates (Plantillas)**: Wireframes/Layouts donde los organismos se integran y proveen estructura (MainLayout).
*   **Pages (Páginas)**: Instancias de los templates con el contenido final inyectado (LandingPage principal).

## 4. Definition of Done (DoD)
Para que una "User Story" o "Task" se considere terminada (Done) debe cumplir con:
1.  Implementado siguiendo la estructura Atomic Design (`src/components/atoms`, etc.).
2.  Lighthouse Score >95 (Performance, SEO, A11y, Best Practices).
3.  Estilos aplicados mediante Tailwind CSS v4 utilizando los tokens definidos.
4.  Cero warnings en consola de React ni errores en ESLint/TypeScript.
5.  Cumplimiento de diseño responsive (Mobile-First 375px a Desktop 1440px).
