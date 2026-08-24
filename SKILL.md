---
name: xai-bug-reporter
description: >
  Encodes the official xAI Grok bug-reporting and human-support process. Guides triage, evidence collection, and a paste-ready report for in-product Report an issue — without inventing support channels or filing tickets. Use when the user wants to report a bug, reach a human, file an issue with xAI, get support for billing or product problems, contact the engineering team, or when a bug occurs in the current chat. Triggers on report a bug, report an issue, reach a human, xAI support, Grok bug, contact xAI, this is broken, something went wrong, help me report this, file a ticket, billing issue, subscription problem. Designed to activate inside the same conversation where the bug happened so the current chat can serve as evidence. Use when the user runs /xai-bug-reporter.
user-invocable: true
license: MIT
compatibility: Requires bash; curl for live share-link checks.
metadata:
  short-description: "Prepare an xAI/Grok bug report"
  author: FineComputer14451
---

# xAI Bug Reporter

Guide users through the official xAI / Grok bug-report and support process. Prefer the in-product **Report an issue** path. Collect required details, run formal triage, validate completeness, and produce a paste-ready report. Never invent support channels.

> **Note**  
> Independent project — **not affiliated with, endorsed by, sponsored by, or officially connected to xAI**. See **Legal Disclaimer** at the end of this file.

## In-chat activation (critical)

This skill is intentionally designed to activate **inside the same conversation where the bug occurred**.

When the user reports a problem with the current chat (e.g. "this is broken", "you just failed", "report this", "something went wrong here"):

1. Activate immediately — do not force the user to start a new chat.
2. Treat the current conversation as primary evidence.
3. Offer to help create a share link for this exact chat (or note that the report is being prepared from this thread).
4. Collect remaining required fields in this same thread.
5. Produce the final paste-ready report here so the user can open the three-dots menu → **Report an issue** and paste it without leaving context.

Never tell the user they must open a different conversation to report the bug that just happened.

## Grok Build

This is a normal Grok Build skill (`SKILL.md` + `scripts/` + `references/`).

- Slash: `/xai-bug-reporter`
- Menu: `/skills` → xai-bug-reporter
- Auto: description triggers (report a bug, reach a human, …)

**Skill directory (`SKILL_DIR`)** is the folder that contains this `SKILL.md` (user: `~/.grok/skills/xai-bug-reporter`, repo: `<repo>/.grok/skills/xai-bug-reporter`). Always run helpers as `bash "$SKILL_DIR/scripts/….sh"` — do not assume the user’s cwd is the skill.

## Usage

### How the skill activates

- Slash command: `/xai-bug-reporter` (Grok Build TUI / slash menu)
- Automatic: user phrases matching the description (report a bug, reach a human, this is broken, etc.).
- Explicit: user says "activate xai-bug-reporter" or "help me report this issue".
- Contextual: a clear failure or anomaly occurs in the current thread and the user asks for help reporting it.

### Typical agent flow

1. **Confirm in-chat context** — Acknowledge the bug happened here (or in a linked chat) and that this skill can prepare the report without leaving.
2. **Triage first** — Run `bash "$SKILL_DIR/scripts/score-severity.sh"` on the problem description, then confirm Severity + Category + Impact with the user (see `$SKILL_DIR/references/triage-protocol.md`).
3. **Collect evidence early** — Prefer a share link of *this* conversation. Use `parse-share-link.sh` and `validate-share-link.sh` under `$SKILL_DIR/scripts/`. Also collect screenshot if available.
4. **Collect required fields** — Account email, subscription tier, platform, system/app info, steps to reproduce. Use `bash "$SKILL_DIR/scripts/collect-platform-info.sh"` where helpful.
5. **Handle missing fields** — List every missing item; never emit a completed report while required fields are incomplete.
6. **Assemble & validate** — `assemble-report.sh` / `prepare-submission.sh` and `validate-report.sh` under `$SKILL_DIR/scripts/`.
7. **Hand off for submission** — Give the paste-ready block + exact steps for the in-product Report an issue flow (or billing email path).

### Scripts

| Script (under `$SKILL_DIR/scripts/`) | Purpose |
|--------|---------|
| `score-severity.sh` | Suggest Severity from description keywords |
| `collect-platform-info.sh` | Collect OS, kernel, GPU, browsers (human or `--json`) |
| `parse-share-link.sh` | Extract id/host from Grok share URLs |
| `validate-share-link.sh` | Structural + live HTTP validation of share links |
| `validate-report.sh` | Check required + preferred fields; exit 0 only when complete |
| `assemble-report.sh` | Build paste-ready report from KEY=VALUE fields |
| `prepare-submission.sh` | Full pipeline: assemble → validate → optional share check → paste package |

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
- Empty or whitespace-only values after a label do not count as present.
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

Channels are defined in `references/official-process.md` (re-check [docs.x.ai](https://docs.x.ai) if the product UI disagrees).

1. **Preferred (Grok web / iOS / Android)**: In-product **Report an issue** / **Report Issue**  
   - Three-dots (⋮) menu next to a response or in the chat interface → Report an issue.  
   - Paste the prepared report. Include account email, platform, steps, and share link or screenshot.

2. **Billing / subscription**: Reply to the receipt / invoice email with account email + invoice/receipt number. Web/Play refunds: https://accounts.x.ai/refund. Apple IAP: Apple’s refund flow.

3. **xAI API bugs only**: Email **support@x.ai** as documented at [Debugging / Bug Report](https://docs.x.ai/developers/debugging) (subject “API Bug Report”, plus request/response/logs). Do **not** give this address as a general Grok-app inbox.

**Never**:
- Invent Discord servers, phone numbers, emails, or unofficial portals. Cite only channels in `references/official-process.md` or a contact the product UI currently shows.
- Claim that a ticket was filed on xAI servers (there is no public submission API).
- Tell the user they must leave the current chat to report a bug that occurred in it.

## Supporting files

All paths are under `$SKILL_DIR`:

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

## Legal Disclaimer

**Independent project.** The **xai-bug-reporter** skill is an independent, community-oriented project. It is **not affiliated with, endorsed by, sponsored by, or officially connected to xAI** in any way.

**Trademarks.** **Grok**, **Grok Build**, **Grok Imagine**, **xAI**, and related names, logos, and marks are trademarks or registered trademarks of their respective owners. Use of these names is for identification and descriptive purposes only and does not imply any endorsement or official relationship.

**No official status.** This skill does not represent xAI, does not speak for xAI support or engineering, and does not provide official customer support. It only helps users prepare materials for the publicly documented support channels (in-product **Report an issue** and billing receipt email).

**No submission authority.** There is no public xAI bug-submission API. This skill **does not** file tickets, open cases, or transmit reports to xAI on the user’s behalf. The user remains solely responsible for submitting any report through official product UI or email paths.

**No warranty.** The software and documentation are provided “AS IS”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from use of the skill or reliance on its guidance.

**Accuracy of process notes.** References to xAI’s FAQ and product flows are based on publicly available documentation at the time of writing. Official processes may change; users should verify current instructions in the product and on docs.x.ai.

**License.** Use of this skill is governed by the MIT License included with the project.
