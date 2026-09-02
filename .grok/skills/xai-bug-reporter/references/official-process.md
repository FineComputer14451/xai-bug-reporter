# Official xAI / Grok bug-report process

This file is the **channel source of truth** for the skill. Other files should point here instead of inventing inboxes.

Last checked against public docs: **2026-09-02**.
Grok FAQ page stamped **2026-08-11**.
API debugging page stamped **2026-05-13**.

Sources:
- [Grok FAQ — How do I report a bug or reach a human?](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human)
- [Debugging / Bug Report](https://docs.x.ai/developers/debugging)
- [xAI product index](https://x.ai/)
- Public status: [status.x.ai](https://status.x.ai) (RSS [status.x.ai/feed.xml](https://status.x.ai/feed.xml))

## Product matrix

Route by **product + surface**, not by how the user phrased the complaint.

| Product / service | Typical surfaces | Official submit path | Notes |
|-------------------|------------------|----------------------|-------|
| **Grok Chat** | grok.com, iOS, Android | In-product **Report an issue** | Preferred for almost all consumer Grok bugs. |
| **Grok Imagine** (in Grok) | grok.com, iOS, Android | In-product **Report an issue** | Image / video generation or editing inside Grok. |
| **Grok Voice** (in Grok) | grok.com, iOS, Android | In-product **Report an issue** | Voice mode, TTS/STT inside the apps. |
| **Grok Build** | grok.com, iOS, Android | In-product **Report an issue** | Replaces unsupported **Grok Studio**. |
| **Companions** | iOS only | In-product **Report an issue** | FAQ: not on web or Android. |
| **Grok Bot** | documented bot surfaces / Grok | In-product **Report an issue** if the bug is in Grok; otherwise follow the product UI | Do not invent a Bot-only inbox. |
| **Connectors** | grok.com, iOS, Android | In-product **Report an issue** | Name the connected service. Auth failures are still Report an issue, not a third-party ticket unless the other product’s UI is the only failure. |
| **Files** (upload / grok.com/files) | grok.com, iOS, Android | In-product **Report an issue** | File-type + size help triage. Delete/manage at [grok.com/files](https://grok.com/files). |
| **Grokipedia** | grokipedia.com | No separate public inbox. If the user is in Grok, use **Report an issue**. If docs and UI disagree, follow the UI. | Do not invent an email. |
| **Accounts / login / settings** | accounts.x.ai, grok.com settings | In-product **Report an issue**, or billing path if it is a charge | Collect user ID when the account is compromised. Deletion self-serve: [accounts.x.ai/account](https://accounts.x.ai/account). |
| **SuperGrok / SuperGrok Heavy / SuperGrokPro billing** | grok.com billing, App Store, Play | Reply to the **receipt / invoice email**. Refunds: [accounts.x.ai/refund](https://accounts.x.ai/refund) (web / Play). Apple IAP → [Apple refund](https://support.apple.com/en-us/118223). Play cancel → [Google Play subscriptions](https://support.google.com/googleplay/answer/7018481). | Manage web billing at [grok.com/?_s=billing](https://grok.com/?_s=billing). If Manage Subscription is blocked, try incognito / disable ad-blockers. |
| **Extra Usage Credits / Auto Top Up** | grok.com Usage tab | Same billing path as SuperGrok (receipt email + refund form by purchase channel) | Credits added on web (FAQ: minimum $5, expire in one year). API prepaid credits are a different bucket and are not refundable. |
| **xAI API** (text, code, Responses) | api.x.ai, console.x.ai | Email **support@x.ai**, subject `API Bug Report`, plus request / response / logs | Not a Grok-app inbox. |
| **Imagine API / Voice API / Batch / Files / Console playground** | console.x.ai, api.x.ai | Same as xAI API: **support@x.ai** | Developer products. |
| **API teams / API invoices / API credits** | console.x.ai | Billing email for the invoice when it is a charge; **support@x.ai** when it is an API defect. Credits are **not refundable** per FAQ. | Large invoices are often SuperGrok Heavy, not API — confirm before routing. |
| **Grok in X** | x.com, X iOS/Android | **X**, not xAI: [X Help Center](https://help.x.com/) or [@premium](https://x.com/premium) | FAQ: xAI provides Grok in X but does **not** have operational oversight of X's service. |
| **X Premium / Premium+ billing** | X | [X refund request](https://help.x.com/forms/x-refund-request) / X Help Center | X processes those refunds, not xAI. |
| **Business / Enterprise / custom pricing** | sales form | [sales@x.ai](mailto:sales@x.ai) is **sales only** | Never use sales@x.ai as a bug or billing-defect inbox. |

If a product is not in this table, **do not invent a channel**. Ask which surface the user was on, then:

1. grok.com / iOS / Android Grok → **Report an issue**
2. console.x.ai / api.x.ai → **support@x.ai**
3. x.com / X apps (X's own service) → X Help Center
4. Otherwise: tell the user to follow whatever contact the **product UI currently shows**, and re-check [docs.x.ai](https://docs.x.ai)

## Outage vs isolated bug

Public status: https://status.x.ai (RSS https://status.x.ai/feed.xml).

- Do **not** fetch or curl the status page.
- If the user describes a total outage, tell them to look at status.x.ai and still prepare the report.
- A status incident explains a widespread event; it does not file a ticket and does not replace **Report an issue** or `support@x.ai`.
- Record what the user says they saw on the status page in `Outage check (status.x.ai):`.

## Consumer Grok (grok.com, iOS, Android)

Source: [Grok FAQ](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human)

1. **Preferred:** in-product **Report an issue** / **Report Issue** (three-dots ⋮ menu next to a response or in the chat UI).
2. **Billing / subscription:** reply to the **receipt / invoice email**. Include account email + invoice/receipt number.
3. **Refunds (web / Google Play):** [xAI Refund Request form](https://accounts.x.ai/refund) (sign in with the subscription account). Approved refunds are typically 5–10 business days to the original payment method (FAQ).
4. **Apple IAP:** [Request a refund through Apple](https://support.apple.com/en-us/118223). [Cancel](https://support.apple.com/en-us/118428) is also Apple-handled.
5. **Google Play cancel:** [Manage Google Play subscriptions](https://support.google.com/googleplay/answer/7018481).
6. **Manage web billing:** [grok.com/?_s=billing](https://grok.com/?_s=billing) while logged in. If **Manage Subscription** does not open, FAQ: ad-blockers or extensions often block it — try incognito or another browser. If still stuck, use in-product **Report an issue** / receipt-email path and ask support to escalate cancel or card-update. Do not invent a separate billing inbox.

The consumer FAQ does **not** publish a general Grok-app support email. “Contact support” in that FAQ means the in-product path, the receipt email for billing, or escalation after the self-serve billing portal fails. Discord is not listed on the FAQ page.

## xAI API (developers)

Source: [Debugging / Bug Report](https://docs.x.ai/developers/debugging)

For **API** bugs, xAI documents emailing **support@x.ai** with subject “API Bug Report”, plus the API request, response, and relevant logs.

The same page also points developers to the `#help` channel of the xAI API Discord (https://discord.gg/x-ai). That is a hangout, not a ticket.

Do not present `support@x.ai` as the inbox for grok.com / iOS / Android product bugs.
Do not present `sales@x.ai` as a bug inbox.

## Grok in X

Source: [Grok FAQ — issues using X](https://docs.x.ai/grok/faq)

xAI provides Grok in X on X.com and X apps but does **not** have operational oversight of X's service. Route X-service issues to [X Help Center](https://help.x.com/) or [@premium](https://x.com/premium).

If the defect is clearly Grok model output that also happens on grok.com, still prepare a Grok **Report an issue** paste, and tell the user X may also need a report if the X UI itself is broken. Primary **Submit via** stays one family; mention the second path in Notes.

## Community hangouts (not tickets)

These Discord invites are public xAI / Grok community servers. They are **not** a bug-submission inbox, not a billing path, and not a substitute for in-product **Report an issue** or `support@x.ai` for API bugs.

| Server | Who it is for | Invite |
|--------|----------------|--------|
| **Grok Community** | grok.com / iOS / Android users | https://discord.gg/kqCc86jM55 |
| **xAI API Discord** | API / developer community (`#help` is documented on the debugging page) | https://discord.gg/x-ai |

Cite **only** these two Discord URLs. Never invent additional servers. Do not claim a Discord message files a ticket.

## What does not exist (publicly)

- No public bug-submission API
- No public phone support
- No guaranteed SLA / response timeline
- No documented Grokipedia-only support inbox
- No xAI inbox for X-platform outages or X Premium billing
- No general Grok-app email (consumer FAQ)
- `sales@x.ai` is not a bug or refund inbox

## Agent rules

- Identify **Product** and **Surface** before choosing a hand-off.
- Prefer in-product **Report an issue** over email whenever the issue is in Grok (web or apps), including Chat, Imagine, Voice, Build, Companions, Bot, Connectors, and Files.
- When the bug occurs in the current chat, treat that chat as the evidence source. Help the user create a share link of *this* conversation.
- Cite **only** channels documented above (or a contact the **product UI itself** currently shows). If docs.x.ai and the UI disagree, tell the user to follow the product UI and re-check the FAQ.
- Never invent additional emails, Discord servers, phone numbers, or portals. The two Discord invites above are the only Discord URLs this skill may cite.
- Subscription tier is required for triage value even though the public FAQ does not always list it explicitly. Reuse a known tier from chat context; never invent an email.
- System and app information (OS, browser/app version, device model, GPU when relevant) improves engineering triage and should be collected.
- For API reports, also collect model name, request id / timestamp, and sanitized request/response. Never ask the user to paste live API keys.
- Strip passwords, 2FA codes, session cookies, and Authorization headers from any paste before READY.
