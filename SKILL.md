---
name: xai-bug-reporter
description: >
  Encodes the official xAI Grok bug-reporting and human-support process.
  Guides triage, evidence collection, and a paste-ready report for the in-product
  Report an issue flow — without inventing support channels or filing tickets.
  Use when the user wants to report a bug, reach a human, file an issue with xAI,
  get support for billing or product problems, contact the engineering team,
  or when a bug occurs in the current chat.
  Triggers on: report a bug, report an issue, reach a human, xAI support, Grok bug,
  contact xAI, this is broken, something went wrong, help me report this,
  file a ticket, billing issue, subscription problem.
  Designed to activate inside the same conversation where the bug happened
  so the current chat can serve as evidence.
  Use when the user runs /xai-bug-reporter.
user-invocable: true
license: MIT
compatibility: grok.com / iOS / Android Skills (instructions-only); optional bash helpers on Grok Build
metadata:
  short-description: "Prepare an xAI/Grok bug report"
  author: FineComputer14451
---

# xAI Bug Reporter

Guide users through the official xAI / Grok bug-report and support process.
Prefer the in-product **Report an issue** path.
Collect required details, run formal triage, validate completeness, and produce a paste-ready report.
Never invent support channels.

> **Note**  
> Independent project — **not affiliated with, endorsed by, sponsored by, or officially connected to xAI**.  
> See **Legal Disclaimer** at the end of this file.

## Runtime

**Default (grok.com / iOS / Android, or any host without this skill’s scripts):**  
Follow THIS file only.  
NEVER run bash, curl, or `scripts/*.sh`.  
NEVER run collect-platform-info (wrong host).  
Ask the user for device model, OS version, and Grok app or browser version.  
Structural share-id check only.  
Assemble the paste block in chat.

**Optional (Grok Build):**  
If `$SKILL_DIR/scripts` exists, you MAY run `bash "$SKILL_DIR/scripts/….sh"`.  
`$SKILL_DIR` is the folder that contains this SKILL.md.  
Live HTTP share check is Grok Build only.

## In-chat activation (critical)

This skill is intentionally designed to activate **inside the same conversation where the bug occurred**.

When the user reports a problem with the current chat (e.g. “this is broken”, “you just failed”, “report this”, “something went wrong here”):

1. Activate immediately — do not force the user to start a new chat.
2. Treat the current conversation as primary evidence.
3. Offer to help create a share link for this exact chat (or note that the report is being prepared from this thread).
4. Collect remaining required fields in this same thread.
5. Produce the final paste-ready report here so the user can open the three-dots menu → **Report an issue** and paste it without leaving context.

Never tell the user they must open a different conversation to report the bug that just happened.

## Typical agent flow

Numbered steps work **without scripts**. Parentheses are Grok Build MAY helpers only.

1. **Confirm in-chat context** — Acknowledge the bug happened here (or in a linked chat). State that the report will be prepared in this same thread.
2. **Triage early** — Propose Severity + Category + Impact from the description, then confirm with the user. (Grok Build MAY run `bash "$SKILL_DIR/scripts/score-severity.sh"`.)
3. **Collect evidence + required fields in parallel**
   - Prefer a share link of *this* conversation (structural share-id check only).
   - Collect: Account email, Subscription tier, Platform, System & app info, Bug description.
   - Push for Steps to reproduce (preferred).
   - Ask for device model, OS version, and Grok app / browser version.
   - (Grok Build MAY run parse/validate-share-link and collect-platform-info scripts.)
4. **Missing-field gate** — Explicitly list every missing required item. Never emit a completed report while any required field is empty or whitespace-only.
5. **Assemble & validate** — Fill the exact paste template. Mark status as READY or INCOMPLETE.
6. **Hand off** — Give the paste-ready block + exact steps for the in-product **Report an issue** flow (or billing path).

## Required fields

Always collect (or confirm) before declaring **Status: READY**:

- Account email
- Subscription tier (Free, SuperGrok, SuperGrokPro, etc.)
- Platform (Web / iOS / Android)
- System and app information (device model, OS version/build, Grok app or browser version)
- Clear description of the bug / issue
- Evidence: conversation share link with a nonempty share id (especially of the current chat) **or** screenshot
- For billing issues: invoice / receipt number

Preferred (push hard; list as missing if absent, but do **not** block READY):

- Steps to reproduce

### Platform-specific tips

- **Web**: browser name + exact version, any relevant extensions, URL of the page.
- **iOS / Android**: device model, full OS version/build, Grok app version from Settings.
- **In-chat bugs**: the share link of *this* conversation is the highest-value evidence.

## Severity table

Confirm Severity, Category, and Impact with the user.  
Automated suggestions (Grok Build scorer or your own reading of the description) are suggestions only.  
Every finished report must include a `=== TRIAGE ===` block.

| Severity  | Definition |
|-----------|------------|
| Critical  | Data loss, security exposure, complete inability to use core product, or widespread outage affecting the user. |
| High      | Major feature broken with no reasonable workaround; repeated crashes; billing charged incorrectly with no self-serve fix. |
| Medium    | Important feature degraded; workaround exists; intermittent failure. |
| Low       | Cosmetic, minor UX annoyance, documentation gap, or edge-case inconvenience. |

**Category** (choose one primary):  
Crash / freeze · Performance / latency · UI / rendering · Authentication / subscription / billing · Image or video generation · Quota / rate-limit · Other (briefly specify)

**Impact:** one or two sentences — what the user cannot do, how often it happens, and whether a workaround exists.

## Share-link rules

Valid evidence URLs only. Never invent or guess a URL.  
Shared chats may be visible to anyone with the link; the user can revoke later.

**Valid hosts and paths** (share id nonempty `[A-Za-z0-9_-]+`):

- `grok.com` | `www.grok.com` | `grok.x.ai` | `grok.x.com` with `/share/<id>`
- `x.com` | `www.x.com` | `twitter.com` with `/i/grok/share/<id>` or `/share/<id>`

**Invalid (no share id):** `https://grok.com/` and `https://grok.com/share/` (and the same pattern on the other valid hosts).

On grok.com / iOS / Android: structural host + nonempty share-id check only. Do not curl the URL.  
Live HTTP share check is Grok Build only.

## Official submission paths (hard rules)

Channels are defined in `references/official-process.md` when that file is present  
(re-check [docs.x.ai](https://docs.x.ai) if the product UI disagrees).

1. **Preferred (Grok web / iOS / Android)**: In-product **Report an issue** / **Report Issue**  
   - Three-dots (⋮) menu next to a response or in the chat interface → Report an issue.  
   - Paste the prepared report. Include account email, platform, steps, and share link or screenshot.

2. **Billing / subscription**: Reply to the receipt / invoice email with account email + invoice/receipt number.  
   Web/Play refunds: https://accounts.x.ai/refund  
   Apple IAP: Apple’s refund flow.

3. **xAI API bugs only**: Email **support@x.ai** as documented at [Debugging / Bug Report](https://docs.x.ai/developers/debugging)  
   (subject “API Bug Report”, plus request/response/logs).  
   Do **not** give this address as a general Grok-app inbox.

**Never**:
- Invent Discord servers, phone numbers, emails, or unofficial portals.  
  Cite only channels in `references/official-process.md` or a contact the product UI currently shows.
- Claim that a ticket was filed on xAI servers (there is no public submission API).
- Tell the user they must leave the current chat to report a bug that occurred in it.

## Paste template

Assemble this block in chat. Field labels and section order must match **exactly**.  
Always include a status line at the top.

```
-----BEGIN REPORT-----
Status: READY | INCOMPLETE

=== TRIAGE ===
Severity:
Category:
Impact:

=== REQUIRED ===
Account email:
Subscription tier:
Platform:
System & app info:
Bug description:

Evidence:
  Conversation share link:
  Screenshot:

=== PREFERRED ===
Steps to reproduce:

=== BILLING (if applicable) ===
Invoice / receipt number:

=== NOTES ===
Workaround:
Frequency:
Reported from inside the chat where the bug occurred:
-----END REPORT-----
```

## Error handling for missing fields

- Never output `Status: READY` while any required field is missing or whitespace-only.
- Always list missing items explicitly in this form:

  Still missing required fields:
  - Account email
  - Platform
  - …

- After the user supplies more information, re-validate the full set and re-emit the complete template.
- If the user refuses a required field, mark `Status: INCOMPLETE`, note the refusal, and still produce the best possible report.

## Grok Build helpers (optional)

Use this section **only** when `$SKILL_DIR/scripts` exists (Grok Build / CLI).  
Consumer grok.com / iOS / Android hosts must ignore it and must NEVER run bash, curl, or `scripts/*.sh`.

This is a normal Grok Build skill (`SKILL.md` + `scripts/` + `references/`).

- Slash: `/xai-bug-reporter`
- Menu: `/skills` → xai-bug-reporter
- Auto: description triggers (report a bug, reach a human, …)

**Skill directory (`SKILL_DIR`)** is the folder that contains this `SKILL.md`  
(user: `~/.grok/skills/xai-bug-reporter`, repo: `<repo>/.grok/skills/xai-bug-reporter`).  
When this section applies, run helpers as `bash "$SKILL_DIR/scripts/….sh"` — do not assume the user’s cwd is the skill.

### Scripts

| Script (under `$SKILL_DIR/scripts/`) | Purpose |
|--------------------------------------|---------|
| `score-severity.sh` | Suggest Severity from description keywords |
| `collect-platform-info.sh` | Collect OS, kernel, GPU, browsers (human or `--json`) |
| `parse-share-link.sh` | Extract id/host from Grok share URLs |
| `validate-share-link.sh` | Structural + live HTTP validation of share links |
| `validate-report.sh` | Check required + preferred fields; exit 0 only when complete |
| `assemble-report.sh` | Build paste-ready report from KEY=VALUE fields |
| `prepare-submission.sh` | Full pipeline: assemble → validate → optional share check → paste package |

## Supporting files

When present, all paths are under `$SKILL_DIR`:

- `references/official-process.md` — Canonical process notes
- `references/triage-protocol.md` — Severity, categories, decision rules
- `references/share-link-guide.md` — How to create and validate share links
- `references/submission-guide.md` — Automation boundaries and paste instructions
- `assets/report-checklist.md` — Ready-to-copy checklist template
- `assets/report.env.example` — Sample field file for assemble/prepare scripts

If those files are not present (consumer upload of `SKILL.md` only), this file is sufficient.

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
