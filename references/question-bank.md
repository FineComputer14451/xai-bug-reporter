# Question bank — one or two at a time

Never dump the full form. Ask only what is still missing. Reuse anything already in this thread.

## Always first (if unknown)

1. Which product were you using — Chat, Imagine, Voice, Build, Companions, Bot, Connectors, Files, billing / credits, API / Console, or Grok in X?
2. Web (grok.com), iOS app, Android app, X, or Console?

Then infer Platform from Surface. Confirm only if unsure.

If they describe a total outage (“Grok is down for everyone”), add — do not replace the pair:

- Glance at https://status.x.ai and tell me if it shows an incident. I will not fetch it for you.

## Grok consumer (Chat / Imagine / Voice / Build / Companions / Bot)

1. Account email + subscription tier (Free / SuperGrok / SuperGrokPro / SuperGrok Heavy). Reuse a known tier from this chat; never invent an email.
2. Device model + OS version + Grok app or browser version.

Next pair if still open:

3. Can you share **this** chat (`https://grok.com/share/<id>`) or attach a screenshot?
4. What should happen vs what happened? How often?

Imagine / Voice / Build / Bot add-on (one extra question, not a second pair unless needed):

- Imagine: T2I, T2V, I2V, or edit — any model/mode label the UI shows?
- Voice: live call vs TTS playback?
- Build: preview, publish, or runtime of a generated app?
- Bot: which bot / workspace, and did the cloud computer itself fail or only the chat UI?

## Connectors

1. Which connected service, and did auth, listing, or the in-chat tool call fail?
2. Account email + screenshot or share link of the failing turn.

Do not send the user to the third-party product’s support unless that product’s own UI is the only failure.

## Files

1. Upload, analysis, or delete at grok.com/files? File type + approximate size?
2. Account email + screenshot or share link.

## Billing / subscription / Extra credits / Auto Top Up

1. Invoice or receipt number + purchase channel (Web / App Store / Google Play / X / API).
2. Account email + whether this is an unrecognized charge, failed refund, SuperGrok Heavy yearly invoice, Extra credits, or Auto Top Up.

Do not assume a large invoice is API usage.
If they cannot open **Manage Subscription** on web: ask whether they tried incognito / another browser (ad-blockers). Do not invent a billing email.

## Accounts / compromise / deletion

1. Login failure, hacked account, or deletion request?
2. Account email + user ID if they have it. Point deletion self-serve at https://accounts.x.ai/account. Still use **Report an issue** — no extra security inbox.

## xAI API / Console / Imagine API / Voice API

1. Model + endpoint + HTTP status + request id or timestamp.
2. Sanitized request/response/logs. Do **not** ask for live API keys.

## Grok in X

1. Did the **X app/UI** fail, or only Grok’s answer?
2. Does the same Grok answer fail on grok.com too?

If X UI / X Premium billing → X Help Center. If the model bug also happens on grok.com → also prepare **Report an issue**.

## Quota / Heavy limits

1. Which meter — Chat, Imagine, Voice, Build, Extra credits, or API credits?
2. Approximate reset time shown in the product, if the user can see it.

Quota defects in Grok apps still go through **Report an issue**, not `support@x.ai`.

## App / browser version check

Do not invent exact in-app Settings labels. Do not treat the current Play/App Store listing as the user’s installed build.

- **Android Grok app** (`ai.x.grok`): long-press icon → App info (or system Settings → Apps → Grok) and copy Version. Optional: Play Store listing to see if an update is pending.
- **iOS Grok app**: iOS Settings → General → iPhone Storage → Grok, or App Store → profile → Grok.
- **grok.com**: browser name + exact version + page URL. Not an app version.
- **Grok in X**: X app version is not the Grok app version. Say the surface is X.

Ask for device model separately if only OS + app version arrived (common on Android).

## Evidence shortcuts

- A `https://grok.com/share/<id>` URL is valid when host is allow-listed and `<id>` is nonempty `[A-Za-z0-9_-]+` (hyphens and underscores count). Example shape: `https://grok.com/share/bGVnYWN5_<uuid-like-id>`.
- Never fetch or curl the URL.
- If the user writes `screenshot: will attach in Report an issue`, count Screenshot as provided for the READY gate. Still prefer a share link of *this* chat.
