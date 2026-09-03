# Submission guide — Chat boundaries

xAI provides **no public bug-submission API**. This skill stops at a validated, paste-ready report **in Chat**.

Canonical channels: `references/official-process.md`.

## Route first

Before assembling the paste block, choose **one** submit path from the product matrix:

| Family | Submit |
|--------|--------|
| Grok consumer (Chat, Imagine, Voice, Build, Companions, Bot-in-Grok, Connectors, Files, Grokipedia-from-Grok) | ⋮ → **Report an issue** |
| SuperGrok / SuperGrokPro / SuperGrok Heavy / Extra credits / Auto Top Up billing, refunds, unrecognized invoices | Reply to receipt email + [accounts.x.ai/refund](https://accounts.x.ai/refund) (web/Play). Apple IAP → [Apple refund](https://support.apple.com/en-us/118223). Play cancel → [Google Play subscriptions](https://support.google.com/googleplay/answer/7018481). |
| xAI API, Console, Imagine API, Voice API, Batch, Files API | Email **support@x.ai** subject `API Bug Report` |
| Grok in X / X app / X Premium billing | [X Help Center](https://help.x.com/) or [@premium](https://x.com/premium). X Premium refunds: [X refund form](https://help.x.com/forms/x-refund-request) |

Do not mix paths. A Grok Chat crash is not an API ticket. An `api.x.ai` 500 is not an in-product Grok report.
If X UI *and* grok.com both show the same model defect, pick one primary **Submit via** and mention the second path in Notes.

## What the skill does in Chat

1. Identify Product + Surface
2. Point the user at https://status.x.ai when they describe a total outage (do not fetch it)
3. Triage (severity + category + impact), confirmed with the user
4. Field collection in this conversation, one or two questions at a time
5. Ask for device / OS / app or browser version (do not probe the host)
6. Structural share-link check (host + nonempty share id only) when the surface is Grok Chat
7. For API: collect sanitized request/response/logs (no API keys)
8. Strip secrets from the paste before READY
9. Report assembly and completeness validation
10. A single paste block + the matching hand-off steps

## What the skill never does

- Run bash, curl, terminal commands, or `scripts/*.sh`
- Fetch status.x.ai or a share URL
- POST or otherwise submit a ticket to xAI servers
- Claim that a report has been “filed” or “ticketed”
- Open the Report an issue UI on the user’s behalf (the user must do that)
- Invent support emails, extra Discord servers, phone numbers, or unofficial portals
- Treat Discord as a bug-submission inbox (Grok Community and xAI API Discord `#help` are hangouts only)
- Tell Grok-app users to email support@x.ai
- Tell anyone to email sales@x.ai for a bug or refund
- Tell API users that ⋮ Report an issue reaches the API team
- Tell X-platform users that xAI operates X

## User-facing hand-off language

### Grok consumer (default)

```
Your report is ready. To submit:

1. Stay in this Grok chat (or the chat where the issue occurred).
2. Tap the three-dots (⋮) menu → Report an issue / Report Issue.
3. Paste the block below.
4. Attach a screenshot if you have one.
5. Submit.

Optional hangouts (not a ticket): Grok Community https://discord.gg/kqCc86jM55
Public status (do not treat as a ticket): https://status.x.ai
```

### Billing / subscription / Extra credits

```
Your billing report is ready. To submit:

1. Reply to the receipt / invoice email with the paste block below.
2. Include the invoice / receipt number and the account email.
3. Web or Google Play refunds: https://accounts.x.ai/refund
4. Apple in-app purchases: https://support.apple.com/en-us/118223
5. Google Play cancel: https://support.google.com/googleplay/answer/7018481
6. Manage web billing: https://grok.com/?_s=billing (incognito if Manage Subscription is blocked).

Optional: also paste the same block via ⋮ → Report an issue on grok.com / the Grok app.
```

### xAI API / Console / Imagine API / Voice API

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

### Grok in X / X service

```
xAI provides Grok in X but does not operate X.

1. X service / X app / X Premium billing → https://help.x.com/ or https://x.com/premium
2. X Premium refunds → https://help.x.com/forms/x-refund-request
3. If the same Grok model bug also happens on grok.com, also paste the block via ⋮ → Report an issue there.
```

## Billing path details

- Reply directly to the receipt / invoice email.
- Web / Google Play refunds: https://accounts.x.ai/refund (sign in with the subscription account). FAQ: approved refunds typically 5–10 business days.
- Apple IAP refund: https://support.apple.com/en-us/118223 — cancel: https://support.apple.com/en-us/118428
- Google Play cancel: https://support.google.com/googleplay/answer/7018481
- Web billing portal: https://grok.com/?_s=billing (logged in). If Manage Subscription does not open, try incognito / disable ad-blockers; then escalate via receipt email or ⋮ Report an issue. Do not invent a billing inbox.
- Extra Usage Credits / Auto Top Up on grok.com use the same SuperGrok billing path, not `support@x.ai`.
- API credits are not refundable (FAQ).
- Unexpected large invoices are often SuperGrok Heavy yearly, not API usage — confirm before routing.
- Quota / weekly Heavy limit complaints in Grok apps use **Report an issue**, not `support@x.ai`.
- Rechecked public FAQ **2026-09-02** (FAQ stamp still **2026-08-11**).

## API path details

Documented at https://docs.x.ai/developers/debugging: email support@x.ai with subject “API Bug Report”, plus request/response/logs.
Optional documented hangout: xAI API Discord `#help` (https://discord.gg/x-ai). Not a ticket.
Public incidents: https://status.x.ai — do not fetch.

## Secrets

Before READY, redact from the paste:

- Live API keys and `Authorization` headers
- Passwords, 2FA / recovery codes, session cookies
- Full payment-card numbers

Keep model name, endpoint, HTTP status, request id, timestamp, and sanitized body excerpts.
