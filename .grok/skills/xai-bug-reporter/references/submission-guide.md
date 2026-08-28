# Submission guide — Chat boundaries

xAI provides **no public bug-submission API**. This skill stops at a validated, paste-ready report **in Chat**.

Canonical channels: `references/official-process.md`.

## Route first

Before assembling the paste block, choose **one** submit path from the product matrix:

| Family | Submit |
|--------|--------|
| Grok consumer (Chat, Imagine, Voice, Build, Companions, Bot-in-Grok, Grokipedia-from-Grok) | ⋮ → **Report an issue** |
| SuperGrok / SuperGrokPro / SuperGrok Heavy billing, refunds, unrecognized invoices | Reply to receipt email + [accounts.x.ai/refund](https://accounts.x.ai/refund) (web/Play). Apple IAP → Apple. |
| xAI API, Console, Imagine API, Voice API, Batch, Files | Email **support@x.ai** subject `API Bug Report` |
| Grok in X / X app / X Premium billing | [X Help Center](https://help.x.com/) or [@premium](https://x.com/premium). X Premium refunds: [X refund form](https://help.x.com/forms/x-refund-request) |

Do not mix paths. A Grok Chat crash is not an API ticket. An `api.x.ai` 500 is not an in-product Grok report.

## What the skill does in Chat

1. Identify Product + Surface
2. Triage (severity + category + impact), confirmed with the user
3. Field collection in this conversation, one or two questions at a time
4. Ask for device / OS / app or browser version (do not probe the host)
5. Structural share-link check (host + nonempty share id only) when the surface is Grok Chat
6. For API: collect sanitized request/response/logs (no API keys)
7. Report assembly and completeness validation
8. A single paste block + the matching hand-off steps

## What the skill never does

- Run bash, curl, terminal commands, or `scripts/*.sh`
- POST or otherwise submit a ticket to xAI servers
- Claim that a report has been “filed” or “ticketed”
- Open the Report an issue UI on the user’s behalf (the user must do that)
- Invent support emails, extra Discord servers, phone numbers, or unofficial portals
- Treat Discord as a bug-submission inbox (Grok Community and xAI API Discord are hangouts only)
- Tell Grok-app users to email support@x.ai
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
```

### Billing / subscription

```
Your billing report is ready. To submit:

1. Reply to the receipt / invoice email with the paste block below.
2. Include the invoice / receipt number and the account email.
3. Web or Google Play refunds: https://accounts.x.ai/refund
4. Apple in-app purchases: use Apple’s refund flow.

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

Optional hangout (not a ticket): xAI API Discord https://discord.gg/x-ai
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
- Web / Google Play refunds: https://accounts.x.ai/refund
- Apple IAP: Apple’s refund flow
- Web billing portal: https://grok.com/?_s=billing
- API credits are not refundable (FAQ).
- Unexpected large invoices are often SuperGrok Heavy yearly, not API usage — confirm before routing.

## API path details

Documented at https://docs.x.ai/developers/debugging: email support@x.ai with subject “API Bug Report”, plus request/response/logs.
