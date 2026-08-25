# Agent supporting files

Master index for the **xai-bug-reporter** agent. One home per fact — do not fork process notes here.

## Skill

| Need | File |
|------|------|
| Chat workflow + paste template | `SKILL.md` |
| Project skill copy | `.grok/skills/xai-bug-reporter/SKILL.md` |
| Agent prompt | `.grok/agents/xai-bug-reporter.md` |
| Project rules | `AGENTS.md` |

## Process (read in Chat; never execute)

| Need | File |
|------|------|
| Official channels + Discord hangouts | `references/official-process.md` |
| Severity / category | `references/triage-protocol.md` |
| Share links | `references/share-link-guide.md` |
| Hand-off / never-file | `references/submission-guide.md` |
| Human checklist | `assets/report-checklist.md` |
| Handoff cards | `.grok/agents/HANDOFF-TEMPLATES.md` |

The Chat zip from `scripts/pack-skill.sh` includes `SKILL.md`, `LICENSE`, `assets/`, and `references/` (no `scripts/`).

## CLI only (humans; not Chat)

`scripts/*.sh` — optional Grok Build helpers. Agents in Chat must ignore them.
