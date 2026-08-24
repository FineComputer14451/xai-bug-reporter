# Formal triage protocol

## 1. Severity scoring (mandatory first step)

Apply the severity table below, then confirm Severity with the user. On grok.com / iOS / Android, NEVER run bash.

Grok Build MAY suggest a value with:

```bash
bash "$SKILL_DIR/scripts/score-severity.sh" "user problem description here"
```

The script (when used) returns a **suggested** severity plus rationale. Always confirm with the user before locking the value.

| Severity  | Definition |
|-----------|------------|
| Critical  | Data loss, security exposure, complete inability to use core product, or widespread outage affecting the user. |
| High      | Major feature broken with no reasonable workaround; repeated crashes; billing charged incorrectly with no self-serve fix. |
| Medium    | Important feature degraded; workaround exists; intermittent failure. |
| Low       | Cosmetic, minor UX annoyance, documentation gap, or edge-case inconvenience. |

## 2. Category (choose one primary)

- Crash / freeze
- Performance / latency
- UI / rendering
- Authentication / subscription / billing
- Image or video generation
- Quota / rate-limit
- Other (briefly specify)

## 3. Impact statement

One or two sentences: what the user cannot do, how often it happens, and whether a workaround exists.

## 4. Agent decision rules

- If the user is vague, score from the description (Grok Build MAY run the scorer), then ask clarifying questions before finalizing Severity/Category.
- High or Critical → strongly push for share link of the failing chat + screenshot + exact reproduction steps.
- Never override a user’s explicit severity choice; document disagreement if the scorer differs.
- Always emit a `=== TRIAGE ===` block in the finished report.
