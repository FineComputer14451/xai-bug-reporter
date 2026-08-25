---
name: xai-bug-reporter
description: >
  Use in Grok Chat (grok.com, iOS, Android) when the user wants to report a bug,
  reach a human, file an issue with xAI, get support for billing or product
  problems, contact the engineering team, or when a bug occurs in the current chat.
  Triggers on: report a bug, report an issue, reach a human, xAI support, Grok bug,
  contact xAI, this is broken, something went wrong, help me report this,
  file a ticket, billing issue, subscription problem, this chat, this conversation.
  Use when the user runs /xai-bug-reporter.
user-invocable: true
license: MIT
compatibility: grok.com / iOS / Android Chat (instructions-only)
metadata:
  short-description: "Prepare an xAI/Grok bug report in Chat"
  author: FineComputer14451
---

# xAI Bug Reporter

Chat-first skill. Guide the user through official xAI / Grok support **in this conversation**.
Prefer in-product **Report an issue**. Collect details, triage, and produce a paste-ready report here.
Never invent support channels. Never file a ticket.

> **Note**  
> Independent project — **not affiliated with, endorsed by, sponsored by, or officially connected to xAI**.  
> See **Legal Disclaimer** at the end of this file.

## Host (Chat)

This skill is for **Grok Chat**: grok.com, iOS, and Android.

- Follow this file.
- When supporting files are present (uploaded zip or project skill folder), **read them**.
- NEVER run bash, curl, terminal commands, or `scripts/*.sh` — even if those files were uploaded in a zip.
- NEVER fetch or curl a share URL. Structural host + nonempty share-id check only.
- Ask the user for device model, OS version, and Grok app or browser version. Do not probe the host.
- Assemble the paste block **in this chat**.

## Supporting files

Read these when present. This file is enough if they are missing. Do not run anything under `scripts/`.

| Path | Use |
|------|-----|
| `references/official-process.md` | Official channels (one home for inboxes) |
| `references/triage-protocol.md` | Severity / category decision rules |
| `references/share-link-guide.md` | How to create and check share links in Chat |
| `references/submission-guide.md` | Paste hand-off; never-file rules |
| `assets/report-checklist.md` | Human-facing twin of the paste template |

## In-chat activation (critical)

Activate **inside the same conversation where the bug occurred**.

When the user reports a problem with the current chat (e.g. “this is broken”, “you just failed”, “report this”, “something went wrong here”):

1. Activate immediately — do not force a new chat.
2. Treat this conversation as primary evidence.
3. Offer to help create a share link for **this** chat (or note that the report is being prepared from this thread).
4. Collect remaining required fields here, **one or two questions at a time**.
5. Produce the paste-ready report here so the user can open ⋮ → **Report an issue** and paste without leaving.

Never tell the user they must open a different conversation to report a bug that happened in this one.

## Chat flow

Numbered steps are the whole skill. No scripts.

1. **Stay here** — Acknowledge the bug (this chat or a linked chat). The report is prepared in this thread.
2. **Reuse what you already know** — Pull the bug description from this thread. Infer **Platform** when obvious: grok.com / browser → Web; Grok iOS app → iOS; Grok Android app → Android. Confirm if unsure.
3. **Triage early** — Propose Severity + Category + Impact from the description, then confirm. Suggestions only; the user’s choice wins.
4. **Collect missing required fields** — Ask **one or two questions at a time** (Chat / mobile). Do not dump an empty form. Prefer a share link of *this* conversation; otherwise a screenshot attached in this chat. Push for Steps to reproduce (preferred, not blocking).
5. **Missing-field gate** — List every missing required item. Never emit `Status: READY` while any required field is empty or whitespace-only.
6. **Assemble** — Fill the exact paste template in this chat. Mark READY or INCOMPLETE.
7. **Hand off** — Paste-ready block + ⋮ → **Report an issue** steps (or billing path).

## Required fields

Always collect (or confirm) before **Status: READY**:

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
- **iOS / Android**: device model, full OS version/build, Grok app version from Settings. Do not invent exact Settings labels.
- **In-chat bugs**: the share link of *this* conversation is the highest-value evidence.

## Severity table

Confirm Severity, Category, and Impact with the user.  
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

**Create a share link in Chat** (do not invent exact control labels):

- **grok.com**: conversation share / link control (header or overflow). Copy `https://grok.com/share/<id>`.
- **iOS / Android**: Share in the conversation menu. The URL should be a grok.com or x.com share page.
- Manage or revoke at the product’s share-links page when logged in (commonly `grok.com/share-links`).

**Valid hosts and paths** (share id nonempty `[A-Za-z0-9_-]+`):

- `grok.com` | `www.grok.com` | `grok.x.ai` | `grok.x.com` with `/share/<id>`
- `x.com` | `www.x.com` | `twitter.com` with `/i/grok/share/<id>` or `/share/<id>`

**Invalid (no share id):** `https://grok.com/` and `https://grok.com/share/` (and the same pattern on the other valid hosts).

Check host + nonempty share-id only. Do not curl the URL.

## Official submission paths (hard rules)

Re-check [docs.x.ai](https://docs.x.ai) if the product UI disagrees.

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
  Cite only channels in `references/official-process.md` (when present) or a contact the product UI currently shows.
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

## Hand-off language

```
Your report is ready. To submit:

1. Stay in this Grok chat (or the chat where the issue occurred).
2. Tap the three-dots (⋮) menu → Report an issue / Report Issue.
3. Paste the block below.
4. Attach a screenshot if you have one.
5. Submit.

For billing issues you can also reply to your receipt email with the same details.
```

Do **not** tell grok.com / iOS / Android users to email support@x.ai. That address is for **xAI API** bugs only.

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
