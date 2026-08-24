# Share-link guide

## Why share links matter

A conversation share link is the highest-value evidence for in-chat bugs. Engineering can see the exact prompts, responses, and timing.

## Creating a share link

- **grok.com / web**: open the conversation → share / link controls (often in the chat header or overflow menu). Copy the resulting `https://grok.com/share/...` URL.
- **X / Grok on X**: use the share affordance that produces `https://x.com/i/grok/share/...` or equivalent.
- **Mobile apps**: look for Share in the conversation menu; the link should resolve to a grok.com or x.com share page.
- Manage or revoke existing links at the product’s share-links management page (commonly `grok.com/share-links` when logged in).

## Agent rules

- Prefer a share link of the **current** conversation when the bug happened here.
- On grok.com / iOS / Android: structural host + nonempty share-id check only; NEVER run bash or curl.
- Grok Build MAY run `bash "$SKILL_DIR/scripts/parse-share-link.sh"` then `bash "$SKILL_DIR/scripts/validate-share-link.sh"`. Live HTTP is Grok Build only.
- A URL without a share id (`https://grok.com/`, `https://grok.com/share/`) is invalid.
- If validation returns `fail_expired_or_private` or network failure, request a fresh share or a screenshot instead.
- Never invent or guess a share URL.
- Remind the user that shared chats may be visible to anyone with the link; they can revoke later.
