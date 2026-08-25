# Submission guide — Chat boundaries

xAI provides **no public bug-submission API**. This skill stops at a validated, paste-ready report **in Chat**.

Canonical channels: `references/official-process.md`.

## What the skill does in Chat

1. Triage (severity + category + impact), confirmed with the user
2. Field collection in this conversation, one or two questions at a time
3. Ask for device / OS / app or browser version (do not probe the host)
4. Structural share-link check (host + nonempty share id only)
5. Report assembly and completeness validation
6. A single paste block + ⋮ **Report an issue** steps

## What the skill never does

- Run bash, curl, terminal commands, or `scripts/*.sh`
- POST or otherwise submit a ticket to xAI servers
- Claim that a report has been “filed” or “ticketed”
- Open the Report an issue UI on the user’s behalf (the user must do that)
- Invent support emails, Discord, phone numbers, or unofficial portals

## User-facing hand-off language (recommended)

```
Your report is ready. To submit:

1. Stay in this Grok chat (or the chat where the issue occurred).
2. Tap the three-dots (⋮) menu → Report an issue / Report Issue.
3. Paste the block below.
4. Attach a screenshot if you have one.
5. Submit.

For billing issues you can also reply to your receipt email with the same details.
```

Do **not** tell grok.com / iOS / Android users to email support@x.ai. That address is documented for **xAI API** bugs only.

## Billing path

- Reply directly to the receipt / invoice email.
- Web / Google Play refunds: https://accounts.x.ai/refund
- Apple IAP: Apple’s refund flow

## API path (only if the issue is the xAI API)

Documented at https://docs.x.ai/developers/debugging: email support@x.ai with subject “API Bug Report”, plus request/response/logs.
