# Submission guide — automation boundaries

xAI provides **no public bug-submission API**. All automation in this skill stops at a validated, paste-ready report.

Canonical channels: `references/official-process.md`.

## What the skill automates

1. Triage (severity scoring + category + impact)
2. Field collection and missing-field enforcement
3. Platform / system / GPU info gathering
4. Share-link parsing and live validation
5. Report assembly and completeness validation
6. Production of a single paste block + clear next steps

## What the skill never does

- POST or otherwise submit a ticket to xAI servers
- Claim that a report has been “filed” or “ticketed”
- Open the Report an issue UI on the user’s behalf (the user must do that)
- Invent support emails, Discord, phone numbers, or unofficial portals

## User-facing hand-off language (recommended)

```
Your report is ready. To submit:

1. Stay in (or open) the Grok chat where the issue occurred, or any Grok chat.
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
