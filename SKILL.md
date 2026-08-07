---
name: xai-bug-reporter
description: Encodes the official xAI Grok bug-reporting and human-support process. Use when the user wants to report a bug, reach a human, file an issue with xAI, get support for billing or product problems, contact the engineering team, or when a bug occurs in the current chat. Triggers on report a bug, report an issue, reach a human, xAI support, Grok bug, contact xAI, this is broken, something went wrong, help me report this, file a ticket, billing issue, subscription problem. Designed to activate inside the same conversation where the bug happened so the current chat can serve as evidence.
---

# xAI Bug Reporter

Guide users through the official xAI / Grok bug-report and support process. Prefer the in-product **Report an issue** path. Collect required details, run formal triage, validate completeness, and produce a paste-ready report. Never invent support channels.

## In-chat activation (critical)

This skill is intentionally designed to activate **inside the same conversation where the bug occurred**.

When the user reports a problem with the current chat (e.g. "this is broken", "you just failed", "report this", "something went wrong here"):

1. Activate immediately — do not force the user to start a new chat.
2. Treat the current conversation as primary evidence.
3. Offer to help create a share link for this exact chat (or note that the report is being prepared from this thread).
4. Collect remaining required fields in this same thread.
5. Produce the final paste-ready report here so the user can open the three-dots menu → **Report an issue** and paste it without leaving context.

Never tell the user they must open a different conversation to report the bug that just happened.

## Usage

### How the skill activates

- Automatic: user phrases matching the description (report a bug, reach a human, this is broken, etc.).
- Explicit: user says "activate xai-bug-reporter" or "help me report this issue".
- Contextual: a clear failure or anomaly occurs in the current thread and the user asks for help reporting it.

### Typical agent flow

1. **Confirm in-chat context** — Acknowledge the bug happened here (or in a linked chat) and that this skill can prepare the report without leaving.
2. **Triage first** — Run `scripts/score-severity.sh` on the problem description, then confirm Severity + Category + Impact with the user (see `references/triage-protocol.md`).
3. **Collect evidence early** — Prefer a share link of *this* conversation. Use `scripts/parse-share-link.sh` and `scripts/validate-share-link.sh`. Also collect screenshot if available.
4. **Collect required fields** — Account email, subscription tier, platform, system/app info, steps to reproduce. Use `scripts/collect-platform-info.sh` where helpful.
5. **Handle missing fields** — List every missing item; never emit a completed report while required fields are incomplete.
6. **Assemble & validate** — Use `scripts/assemble-report.sh` / `scripts/prepare-submission.sh` and `scripts/validate-report.sh`.
7. **Hand off for submission** — Give the paste-ready block + exact steps for the in-product Report an issue flow (or billing email path).

### Scripts

| Script | Purpose |
|--------|---------|
| `scripts/score-severity.sh` | Suggest Severity from description keywords |
| `scripts/collect-platform-info.sh` | Collect OS, kernel, GPU, browsers (human or `--json`) |
| `scripts/parse-share-link.sh` | Extract id/host from Grok share URLs |
| `scripts/validate-share-link.sh` | Structural + live HTTP validation of share links |
| `scripts/validate-report.sh` | Check required + preferred fields; exit 0 only when complete |
| `scripts/assemble-report.sh` | Build paste-ready report from KEY=VALUE fields |
| `scripts/prepare-submission.sh` | Full pipeline: assemble → validate → optional share check → paste package |

## Required fields

Always collect (or confirm) before declaring the report ready:

- Account email
- Subscription tier (Free, SuperGrok, SuperGrokPro, etc.)
- Platform (Web / iOS / Android)
- System and app information (OS version, device model, Grok app or browser version)
- Clear description of the bug / issue
- Steps to reproduce (strongly preferred; push for them)
- Evidence: conversation share link (especially of the current chat) **or** screenshot
- For billing issues: invoice / receipt number

### Platform-specific tips

- **Web**: browser name + exact version, any relevant extensions, URL of the page.
- **iOS / Android**: device model, full OS version/build, Grok app version from Settings.
- **In-chat bugs**: the share link of *this* conversation is the highest-value evidence.

## Error handling for missing fields

- Never output a "ready to submit" report while any required field is missing.
- Explicitly list every missing item.
- After the user supplies more information, re-validate the full set.
- If the user refuses a field, note the refusal and still produce the best possible report, but mark it incomplete.

## Formal triage

Follow `references/triage-protocol.md`.

- Severity: Critical / High / Medium / Low (use the scorer, then confirm with user).
- Category: Crash, Performance, UI, Auth/Billing, Generation (image/video), Quota, Other.
- Impact statement required.
- Append a `=== TRIAGE ===` block to every finished report.

## Official submission paths (hard rules)

1. **Preferred**: In-product **Report an issue** / **Report Issue**  
   - Three-dots (⋮) menu next to a response or in the chat interface → Report an issue.  
   - Paste the prepared report. Include account email, platform, steps, and share link or screenshot.

2. **Billing / subscription**: Reply to the receipt email, or email support with account email + invoice/receipt number.

3. **General support email**: support@x.ai (or the official short link the product surfaces). Always include the collected fields.

**Never**:
- Invent Discord servers, phone numbers, other email addresses, or unofficial portals.
- Claim that a ticket was filed on xAI servers (there is no public submission API).
- Tell the user they must leave the current chat to report a bug that occurred in it.

## Supporting files

- `references/official-process.md` — Canonical process notes
- `references/triage-protocol.md` — Severity, categories, decision rules
- `references/share-link-guide.md` — How to create and validate share links
- `references/submission-guide.md` — Automation boundaries and paste instructions
- `assets/report-checklist.md` — Ready-to-copy checklist template
- `assets/report.env.example` — Sample field file for assemble/prepare scripts

## Expectations to set with the user

- Reports go to the engineering / support team.
- No guaranteed response timeline.
- Fixes usually ship in product updates; keep the app and browser updated.
- A complete report with share link + steps to reproduce has the highest chance of useful triage.
