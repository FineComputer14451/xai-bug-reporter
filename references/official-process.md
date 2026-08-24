# Official xAI / Grok bug-report process

This file is the **channel source of truth** for the skill. Other files should point here instead of inventing inboxes.

Last checked against public docs: **2026-08-24**.

## Consumer Grok (grok.com, iOS, Android)

Source: [Grok FAQ — How do I report a bug or reach a human?](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human)

1. **Preferred:** in-product **Report an issue** / **Report Issue** (three-dots ⋮ menu next to a response or in the chat UI).
2. **Billing / subscription:** reply to the **receipt / invoice email**. Include account email + invoice/receipt number.
3. **Refunds (web / Google Play):** [xAI Refund Request form](https://accounts.x.ai/refund). Apple IAP refunds go through Apple.

The consumer FAQ does **not** publish a general Grok-app support inbox. “Contact support” in that FAQ means the in-product path (or the receipt email for billing).

## xAI API (developers)

Source: [Debugging / Bug Report](https://docs.x.ai/developers/debugging)

For **API** bugs, xAI documents emailing **support@x.ai** with subject “API Bug Report”, plus the API request, response, and relevant logs.

Do not present this address as the inbox for grok.com / iOS / Android product bugs.

## What does not exist (publicly)

- No public bug-submission API
- No public phone support
- No public Discord (or other unofficial portals)
- No guaranteed SLA / response timeline

## Agent rules

- Prefer in-product **Report an issue** over email whenever the issue is in Grok (web or apps).
- When the bug occurs in the current chat, treat that chat as the evidence source. Help the user create a share link of *this* conversation.
- Cite **only** channels documented above (or a contact the **product UI itself** currently shows). If docs.x.ai and the UI disagree, tell the user to follow the product UI and re-check the FAQ.
- Never invent additional emails, Discord servers, phone numbers, or portals.
- Subscription tier is required for triage value even though the public FAQ does not always list it explicitly.
- System and app information (OS, browser/app version, device model, GPU when relevant) improves engineering triage and should be collected.
