# ADR-004: Adopción de Arquitectura Monorepo (Orchestrator-Workers)

## Status
Accepted

## Context
EjeClick comenzó como un proyecto singular (Landing Page). Sin embargo, el ecosistema está evolucionando para incorporar múltiples aplicaciones (e.g., portal de clientes, dashboard administrativo) que requerirán compartir sistemas de diseño, componentes UI y lógica de negocio. Además, el protocolo de agentes requiere una estructura clara de "Orquestador-Trabajadores" según las directrices de Anthropic.

## Decision
Migraremos el repositorio actual a una **arquitectura Monorepo** usando espacios de trabajo nativos (npm workspaces). 
La estructura seguirá el patrón Anthropic Orchestrator-Workers:
- `apps/`: Contendrá los subsistemas ejecutables (landing-page, dashboard, etc.).
- `packages/`: Contendrá bibliotecas compartidas (ui-components, configs).
- `backend/`: Actuará como la API central (MCP Server potencial).
- **Hierarchical Instructions**: Se mantendrá un `CLAUDE.md` global como Orquestador en la raíz, y se crearán `CLAUDE.md` específicos por aplicación/paquete (Workers).

## Consequences
**Positivas:**
- Reutilización instantánea de código (Atomic Design) a través de todo el ecosistema.
- Centralización de dependencias globales.
- Permite a los Agentes IA delegar tareas por sub-directorios (Routing context).

**Negativas:**
- Aumenta la complejidad inicial de la configuración del entorno y scripts de despliegue (Docker debe ser refactorizado para soportar contextos de build más complejos).
- Los comandos de desarrollo (e.g., `npm run dev`) deberán orquestarse desde la raíz.
