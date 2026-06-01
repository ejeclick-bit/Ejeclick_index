# ADR-006: Agent Loop como primera instrucción en CLAUDE.md

**Fecha:** 2026-05-27
**Status:** accepted

## Contexto

El agente (IA) no estaba siguiendo el ciclo definido en AGENTS.md. Las causas identificadas:

1. El loop estaba en AGENTS.md, que se importa vía `@AGENTS.md`, pero después vienen secciones de proyecto, estructura, comandos, etc. antes de que el agente vea las instrucciones críticas.
2. AGENTS.md tenía 7 líneas de YAML frontmatter al inicio que no aportan instrucciones al agente, consumiendo espacio de contexto valioso.
3. No había un "imperativo" claro: las instrucciones eran descriptivas ("Every task must follow...") no obligatorias ejecutables.
4. El agente (yo mismo) no estaba cargando skills antes de implementar.

## Opciones Consideradas

1. **Mover el loop al inicio de CLAUDE.md** — antes de cualquier info del proyecto. El agente lo ve primero.
2. **Solo depender de AGENTS.md** — mantenerlo como estaba, confiar en que el agente lo lea.
3. **Poner el loop en un archivo separado** — crear un archivo de solo instrucciones obligatorias.

## Decisión

Opción 1: Reestructurar CLAUDE.md para que el loop sea lo primero que el agente ve después del título. AGENTS.md sin frontmatter.

## Consecuencias

**Positivas:**
- El agente ve el loop antes de cualquier información del proyecto
- Reduce la probabilidad de que el ciclo se ignore
- Elimina 7 líneas de frontmatter sin valor instructivo

**Negativas:**
- CLAUDE.md es más verboso al inicio
- Depende de que el modelo lea el contenido en orden
