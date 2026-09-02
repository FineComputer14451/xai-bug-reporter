---
name: xai-bug-reporter
description: Use in Grok Chat when the user wants to report a bug or reach support for any xAI product or service — Grok Chat, Imagine, Voice, Build, Companions, Bot, Connectors, Files, Grokipedia, accounts, SuperGrok billing, Extra Usage Credits, Auto Top Up, refunds, xAI API, Console, Imagine API, Voice API, or Grok in X. Triggers include report a bug, report an issue, reach a human, xAI support, Grok bug, Imagine bug, Voice bug, Build bug, API bug, billing issue, subscription problem, refund, cancel subscription, this is broken, something went wrong, help me report this, file a ticket, this chat, this conversation, outage, quota. Use when the user runs /xai-bug-reporter.
license: MIT
compatibility: grok.com / iOS / Android Chat (instructions-only)
metadata:
  short-description: Prepare an xAI/Grok bug report in Chat
  author: FineComputer14451
  user-invocable: true
  version: "1.4.1"
---

# xAI Bug Reporter

Chat-first skill for **every public xAI product and service**.
Guide the user through the official path **in this conversation**.
Route by product: Grok apps → **Report an issue**; billing → receipt / refund form; API / Console → **support@x.ai**; Grok in X / X billing → X Help Center.
Never invent support channels. Never file a ticket.

> **Note**
> Independent project — **not affiliated with, endorsed by, sponsored by, or officially connected to xAI**.
> See **Legal Disclaimer** at the end of this file.

## Host (Chat)

This skill is for **Grok Chat**: grok.com, iOS, and Android.

- Follow this file.
- When supporting files are present (uploaded zip or project skill folder), **read them**.
- NEVER run bash, curl, terminal commands, or `scripts/*.sh` — even if those files were uploaded in a zip.
- NEVER fetch or curl a share URL or status.x.ai. Structural checks and public wording only.
- Ask the user for device model, OS version, and Grok app or browser version. Do not probe the host.
- Assemble the paste block **in this chat**.
- Read this **whole** file. READY gate and Hand-off language are mandatory even if triage already looks done.

## Supporting files

Read these when present. This file is enough if they are missing. Do not run anything under `scripts/`.

| Path | Use |
|------|-----|
| `references/official-process.md` | Official channels (one home for inboxes) |
| `references/triage-protocol.md` | Severity / category decision rules |
| `references/share-link-guide.md` | How to create and check share links in Chat |
| `references/submission-guide.md` | Paste hand-off; never-file rules |
| `references/question-bank.md` | First two questions per product family |
| `references/report-checklist.md` | Same labels as the paste template |
| `references/report.env.example` | Field crib only. Not an executable config. |
| `references/LICENSE` | License text |

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

1. **Stay here** — Acknowledge the bug (this chat, a linked chat, or another xAI surface). The report is prepared in this thread.
2. **Name the product** — Identify **Product** and **Surface** before anything else. Use the matrix in `references/official-process.md` when present. If unclear, ask one question: Chat / Imagine / Voice / Build / Companions / Bot / Connectors / Files / Grokipedia / accounts / billing / credits / API / Console / Grok in X / other.
3. **Reuse what you already know** — Pull the bug description from this thread. Fill **Surface** and **Platform** as two fields, never copies of each other. **Surface** is where the bug happened (grok.com, iOS Grok app, Android Grok app, grokipedia.com, console.x.ai, x.com, …). **Platform** is the client family: grok.com / browser → Web; Grok iOS app → iOS; Grok Android app → Android; console.x.ai / api.x.ai → API / Console; x.com / X apps → X. Confirm if unsure. Reuse a known **Subscription tier** from this chat’s user context when present. Never invent an account email.
4. **Outage vs isolated** — If the user describes a total outage or “everyone is down”, tell them to glance at the public status page **https://status.x.ai** (and RSS https://status.x.ai/feed.xml). Do not fetch it. Still prepare a report. A status incident does not replace **Report an issue** or `support@x.ai`.
5. **Triage early** — Propose Severity + Category + Impact from the description, then confirm. Suggestions only; the user’s choice wins.
6. **Collect missing required fields** — Ask **one or two questions at a time**. Use `references/question-bank.md` when present. Do not dump an empty form. Grok Chat: prefer a share link of *this* conversation. API: sanitized request/response/logs, no keys. Billing: invoice / receipt number + purchase channel.
7. **Missing-field gate** — List every missing required item. Never emit `Status: READY` while any required field is empty or whitespace-only. Treat `https://grok.com/share/` with no id as missing evidence.
8. **Sanitize** — Before READY, strip live API keys, passwords, 2FA codes, session cookies, and full Authorization headers from the paste. Keep request ids, model names, HTTP status, timestamps.
9. **Assemble** — Fill the exact paste template in this chat. Mark READY or INCOMPLETE.
10. **Hand off** — Paste-ready block + the matching path (Report an issue, billing email/refund, support@x.ai, or X Help Center). Never mix paths. If X UI *and* grok.com both fail the same model bug, say so in Notes and still pick one primary **Submit via**.

## Required fields

Always collect (or confirm) before **Status: READY**:

- Product (Chat, Imagine, Voice, Build, Companions (iOS only), Bot, Connectors, Files, Grokipedia, Accounts, Billing, Extra credits, API, Console, Imagine API, Voice API, Grok in X, other)
- Surface (where it happened: grok.com, iOS Grok app, Android Grok app, grokipedia.com, console.x.ai, x.com, …)
- Platform (client family: Web / iOS / Android / X / API / Console / Other)
- Account email
- Subscription tier (Free, SuperGrok, SuperGrokPro, SuperGrok Heavy, API plan, X Premium, Extra credits, etc.)
- System and app information (device model, OS version/build, Grok app or browser version; for API: SDK / client)
- Clear description of the bug / issue
- Evidence: conversation share link with a nonempty share id (especially of the current chat) **or** screenshot. API: sanitized request/response/logs instead of or in addition to a screenshot.
- For billing / credits / refund issues: invoice / receipt number **and** purchase channel
- Submit-via path chosen from the official matrix

Preferred (push hard; list as missing if absent, but do **not** block READY):

- Steps to reproduce
- Expected vs actual

### Platform-specific tips

- **Web (grok.com)**: browser name + exact version, any relevant extensions, URL of the page.
- **iOS / Android**: device model, full OS version/build, Grok app version from Settings. Do not invent exact Settings labels.
- **In-chat bugs**: the share link of *this* conversation is the highest-value evidence.
- **Imagine / Voice / Build**: name the mode (T2V, I2V, edit, voice call, published app) and any model or feature label the UI shows.
- **Connectors**: name the connected service and whether auth, listing, or in-chat tool call failed.
- **Files**: file type, approximate size, and whether upload, analysis, or delete at grok.com/files failed.
- **API / Console**: model name, endpoint, HTTP status, request id or timestamp, sanitized payload. Never collect API keys.
- **Grok in X**: say whether the X UI itself failed or only Grok’s answer did. X-service issues go to X, not xAI.
- **Companions**: iOS only (FAQ: not on web or Android). If the user is on web or Android, they are not on Companions — re-identify the product.
- **Grokipedia**: grokipedia.com has no separate inbox. If the user is in Grok, use **Report an issue**. Do not invent an email.

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
Crash / freeze · Performance / latency · UI / rendering · Authentication / subscription / billing · Image or video generation · Voice / audio · Grok Build / generated apps · Connectors / files · API / Console / developer tooling · Quota / rate-limit · Grok in X / X integration · Other (briefly specify)

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
Full matrix: `references/official-process.md`.
Public FAQ last updated **2026-08-11**. Rechecked **2026-09-02**. API debugging page stamped **2026-05-13**.

1. **Grok consumer** (Chat, Imagine, Voice, Build, Companions, Bot-in-Grok, Connectors, Files, most grok.com / iOS / Android bugs): In-product **Report an issue** / **Report Issue**
   - Three-dots (⋮) menu next to a response or in the chat interface → Report an issue.
   - Paste the prepared report. Include account email, product, platform, steps, and share link or screenshot.

2. **Billing / SuperGrok / SuperGrokPro / SuperGrok Heavy / Extra credits / Auto Top Up**: Reply to the receipt / invoice email with account email + invoice/receipt number.
   Web/Play refunds: https://accounts.x.ai/refund (sign in with the subscription account).
   Apple IAP refunds: Apple’s flow — https://support.apple.com/en-us/118223 (cancel: https://support.apple.com/en-us/118428).
   Google Play cancel: https://support.google.com/googleplay/answer/7018481
   Web billing portal: https://grok.com/?_s=billing (logged in). If **Manage Subscription** does not open, try incognito or disable ad-blockers/extensions; FAQ says support can escalate cancel or card-update after that.
   Unexpected large invoices are often SuperGrok Heavy yearly, not API — confirm before routing.
   API credits are not refundable.

3. **xAI developer products** (API, Console, Imagine API, Voice API, Batch, Files API): Email **support@x.ai** as documented at [Debugging / Bug Report](https://docs.x.ai/developers/debugging)
   (subject “API Bug Report”, plus request/response/logs).
   Do **not** give this address as a general Grok-app inbox.
   Do **not** use **sales@x.ai** for bugs (sales / custom pricing only).

4. **Grok in X / X service / X Premium billing**: X, not xAI. [X Help Center](https://help.x.com/) or [@premium](https://x.com/premium). X Premium refunds: [X refund form](https://help.x.com/forms/x-refund-request).
   If the same Grok model bug also happens on grok.com, also use **Report an issue** there.

5. **Accounts / compromise / deletion**: In-product **Report an issue** plus user ID when the account is compromised. Self-serve deletion: https://accounts.x.ai/account. Do not invent a security inbox.

6. **Community hangouts (not tickets)** — optional, after the official path:
   - Grok Community (product users): https://discord.gg/kqCc86jM55
   - xAI API Discord (developers, documented `#help` on the debugging page): https://discord.gg/x-ai
   These are not a bug-submission inbox. Do not tell the user a Discord post files a ticket.

**Never**:

- Invent Discord servers, phone numbers, emails, or unofficial portals.
  Cite only channels in `references/official-process.md` (when present), the two Discord invites above, or a contact the product UI currently shows.
- Claim that a ticket was filed on xAI servers (there is no public submission API).
- Tell the user they must leave the current chat to report a bug that occurred in it.
- Fetch status.x.ai or a share URL.

## Paste template

Assemble this block in chat. Field labels and section order must match **exactly**.
Always include a status line at the top.

```
-----BEGIN REPORT-----
Status: READY | INCOMPLETE

=== TRIAGE ===
Product:
Surface:
Submit via:
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
  API request / response / logs (sanitized):

=== PREFERRED ===
Steps to reproduce:
Expected vs actual:

=== BILLING (if applicable) ===
Invoice / receipt number:
Purchase channel (Web / App Store / Google Play / X / API):

=== NOTES ===
Workaround:
Frequency:
Reported from inside the chat where the bug occurred:
Outage check (status.x.ai):
-----END REPORT-----
```

## READY gate

`Status: READY` only if every item below is nonempty after trim:

- Product, Surface, Submit via
- Severity, Category, Impact
- Account email, Subscription tier, Platform
- System & app info, Bug description
- Evidence: a share link with a nonempty share id, **or** a screenshot actually attached in this chat, **or** (API only) sanitized request/response/logs. A promise such as `screenshot: will attach in Report an issue` is **not** evidence. READY needs one real item now.
- Billing / credits / refund issues also need invoice / receipt number **and** purchase channel (Web / App Store / Google Play / X / API). Channel picks Apple vs `accounts.x.ai/refund` vs X.
- Paste contains no live API key, password, 2FA code, or session cookie.

Otherwise `Status: INCOMPLETE` and list the missing items.

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

Emit **exactly one** Hand-off language block. Primary **Submit via** stays one family. If the same Grok model bug also happens on grok.com and X, keep one primary Submit via and put the second path only in Notes (the Grok-in-X block’s step 3 is that Notes exception, not a second family).

**Grok consumer** (Chat, Imagine, Voice, Build, Companions, Bot, Connectors, Files, Grokipedia, Accounts):

```
Your report is ready. To submit:

1. Stay in this Grok chat (or the chat where the issue occurred).
2. Tap the three-dots (⋮) menu → Report an issue / Report Issue.
3. Paste the block below.
4. Attach a screenshot if you have one.
5. Submit.

Optional hangout (not a ticket): Grok Community https://discord.gg/kqCc86jM55
Public status (do not treat as a ticket): https://status.x.ai
```

**Billing / subscription / Extra credits:**

```
Your billing report is ready. To submit:

1. Reply to the receipt / invoice email with the paste block below.
2. Include the invoice / receipt number and the account email.
3. Web or Google Play refunds: https://accounts.x.ai/refund
4. Apple in-app purchases: https://support.apple.com/en-us/118223
5. Google Play cancel: https://support.google.com/googleplay/answer/7018481
6. Manage web billing: https://grok.com/?_s=billing (incognito if Manage Subscription is blocked).
```

**xAI API / Console / Imagine API / Voice API:**

```
Your API report is ready. To submit:

1. Email support@x.ai
2. Subject: API Bug Report
3. Paste the block below.
4. Attach sanitized request, response, and relevant logs.
5. Do not send live API keys.

Optional hangout (not a ticket): xAI API Discord https://discord.gg/x-ai (#help)
Public status: https://status.x.ai
```

**Grok in X / X service:**

```
xAI provides Grok in X but does not operate X.

1. X service / X app / X Premium billing → https://help.x.com/ or https://x.com/premium
2. X Premium refunds → https://help.x.com/forms/x-refund-request
3. If the same Grok model bug also happens on grok.com, also paste via ⋮ → Report an issue there.
```

Do **not** tell grok.com / iOS / Android users to email support@x.ai. That address is for **xAI API** bugs only.

## Expectations to set with the user

- Reports go to the engineering / support team.
- No guaranteed response timeline.
- Fixes usually ship in product updates; keep the app and browser updated.
- A complete report with share link + steps to reproduce has the highest chance of useful triage.
- A banner on https://status.x.ai explains a widespread incident; it does not file a ticket for the user.

## Legal Disclaimer

**Independent project.** The **xai-bug-reporter** skill is an independent, community-oriented project. It is **not affiliated with, endorsed by, sponsored by, or officially connected to xAI** in any way.

**Trademarks.** **Grok**, **Grok Build**, **Grok Imagine**, **xAI**, and related names, logos, and marks are trademarks or registered trademarks of their respective owners. Use of these names is for identification and descriptive purposes only and does not imply any endorsement or official relationship.

**No official status.** This skill does not represent xAI, does not speak for xAI support or engineering, and does not provide official customer support. It only helps users prepare materials for the publicly documented support channels (in-product **Report an issue**, billing receipt / refund form, `support@x.ai` for API bugs, and X Help Center for X-service issues).

**No submission authority.** There is no public xAI bug-submission API. This skill **does not** file tickets, open cases, or transmit reports to xAI on the user’s behalf. The user remains solely responsible for submitting any report through official product UI or email paths.

**No warranty.** The software and documentation are provided “AS IS”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from use of the skill or reliance on its guidance.

**Accuracy of process notes.** References to xAI’s FAQ and product flows are based on publicly available documentation at the time of writing. Official processes may change; users should verify current instructions in the product and on docs.x.ai.

**License.** Use of this skill is governed by the MIT License included with the project.
