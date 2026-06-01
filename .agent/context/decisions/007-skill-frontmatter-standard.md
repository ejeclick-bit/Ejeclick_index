# ADR-007: Skill Frontmatter Standardization to Anthropic Spec

**Date:** 2026-05-29
**Status:** accepted

## Context

The 9 skills in `.claude/skills/` used custom frontmatter fields (`version`, `triggers`, `related_skills`) that are not part of the official Anthropic skill specification. The official spec (https://docs.anthropic.com/en/docs/claude-code/skills) defines a specific set of frontmatter fields. Non-standard fields are ignored by Claude Code but add noise and confusion — they suggest a capability that doesn't exist.

## Decision

Strip all non-standard frontmatter fields from every skill's `SKILL.md`:

- **Removed:** `version`, `triggers`, `related_skills`
- **Replaced:** `triggers` (YAML list) → `when_to_use` (YAML string), which IS a standard field per the Anthropic spec
- **Kept:** `name`, `description` — both are standard fields

The body markdown content is left untouched; it follows the free-form markdown standard.

## Consequences

- All 9 skills now use only the official Anthropic frontmatter fields
- `when_to_use` is appended to `description` in the skill listing (up to 1,536-char cap), giving Claude better trigger context
- No functional change to how skills load or execute
- Cleaner frontmatter that documents real, supported behavior only
