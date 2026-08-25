# xai-bug-reporter

Chat-first Grok skill and agent. Prepare a paste-ready **Report an issue** package in the current conversation. Independent project — **not affiliated with xAI**.

## Load

| Kind | Path |
|------|------|
| Skill | `SKILL.md` and `.grok/skills/xai-bug-reporter/SKILL.md` |
| Agent | `.grok/agents/xai-bug-reporter.md` |
| Agent index | `.grok/agents/REFERENCES.md` |
| Handoff cards | `.grok/agents/HANDOFF-TEMPLATES.md` |

## Supporting files (read; never execute)

| Path | Use |
|------|-----|
| `references/official-process.md` | Official channels (one home) |
| `references/triage-protocol.md` | Severity / category |
| `references/share-link-guide.md` | Share links in Chat |
| `references/submission-guide.md` | Paste hand-off; never-file |
| `assets/report-checklist.md` | Human-facing paste twin |

`scripts/` is optional CLI for humans. **Never** run bash, curl, or `scripts/*.sh` in Grok Chat (grok.com / iOS / Android), even if those files are in a zip.

## Hard rules

- Stay in the chat where the bug happened.
- Ask one or two questions at a time.
- Cite only channels in `references/official-process.md` or the product UI.
- Never invent inboxes. Never claim a ticket was filed.
- `support@x.ai` is for **xAI API** bugs only, not the Grok app.
