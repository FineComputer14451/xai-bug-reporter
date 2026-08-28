# Formal triage protocol

## 0. Product + surface (mandatory first)

Name the product and surface before scoring severity.

Examples: Grok Chat on grok.com · Grok Imagine on iOS · Grok Voice on Android · Grok Build on web · Companions on iOS · xAI API on console.x.ai · Imagine API · Voice API · Grok in X on x.com · SuperGrok billing on web.

If unknown, ask. Do not assume grok.com.

## 1. Severity scoring

Apply the severity table below, then confirm Severity with the user.
NEVER run bash. Score from the description in Chat; suggestions only.

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
- Voice / audio
- Grok Build / generated apps
- API / Console / developer tooling
- Quota / rate-limit
- Grok in X / X integration
- Other (briefly specify)

## 3. Impact statement

One or two sentences: what the user cannot do, how often it happens, and whether a workaround exists.

## 4. Agent decision rules

- If the user is vague, score from the description, then ask clarifying questions before finalizing Severity/Category.
- High or Critical → strongly push for share link of the failing chat + screenshot + exact reproduction steps. API High/Critical → request id, model, sanitized payload.
- Never override a user’s explicit severity choice; document disagreement if your suggestion differs.
- Always emit a `=== TRIAGE ===` block in the finished report, including Product and Surface.
- Route the hand-off from Product + Surface using `references/official-process.md`. Never mix Grok-app, API, X, and billing inboxes.
