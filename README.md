# xai-bug-reporter

**Grok Chat skill** (grok.com, iOS, Android) that encodes the official xAI / Grok bug-reporting and human-support process.

It guides the conversation through formal triage, evidence collection, and a paste-ready report for the in-product **Report an issue** flow — without inventing support channels, running scripts, or claiming to file tickets on xAI servers.

Install on [grok.com/skills](https://grok.com/skills), then say “report a bug” in the chat where it happened. Companion desk: [xAI Bug Reporter](https://finecomputer14451.github.io/xai-bug-reporter).

[![Grok Chat](https://img.shields.io/badge/Grok_Chat-skills-0C0C0D?logo=x&logoColor=white)](https://grok.com/skills)
[![SKILL.md](https://img.shields.io/badge/SKILL.md-raw-222?logo=markdown&logoColor=white)](https://github.com/FineComputer14451/xai-bug-reporter/raw/main/SKILL.md)
[![Grok Community](https://img.shields.io/badge/Discord-Grok_Community-5865F2?logo=discord&logoColor=white)](https://discord.gg/kqCc86jM55)
[![xAI API Discord](https://img.shields.io/badge/Discord-xAI_API-5865F2?logo=discord&logoColor=white)](https://discord.gg/x-ai)
[![Web desk](https://img.shields.io/badge/web_desk-live-0C0C0D?logo=github&logoColor=white)](https://finecomputer14451.github.io/xai-bug-reporter)
[![Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](https://github.com/FineComputer14451/xai-bug-reporter/network/updates)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/FineComputer14451/xai-bug-reporter)](https://github.com/FineComputer14451/xai-bug-reporter/commits/main)

> **Note**  
> Independent project — **not affiliated with, endorsed by, sponsored by, or officially connected to xAI**. See [Legal Disclaimer](#legal-disclaimer).

---

## Install in Grok Chat

**Primary host** is Grok Chat — grok.com, iOS, and Android ([Grok Skills](https://x.ai/news/grok-skills)). No bash. Skill version **1.4.0**. The agent follows `SKILL.md` and the supporting `references/` + `assets/` files when those are in the upload.

### grok.com (web)

Official: create by conversation, upload a file, or Skill Creator. [grok.com/skills](https://grok.com/skills)

1. Upload [`SKILL.md`](https://github.com/FineComputer14451/xai-bug-reporter/raw/main/SKILL.md) (**Raw**), **or** the Chat zip (`SKILL.md` + `assets/` + `references/`, no `scripts/`). Each [Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml) run on `main` uploads artifact `xai-bug-reporter-skill`. Skill hosts reject zip members that are symlinks — do not upload an older GitHub archive of this repo that still contained `.grok/skills` links.
2. Ask Skill Creator to save it as skill `xai-bug-reporter`.
3. In **any Grok chat**, say “report a bug” / “this is broken” / “use xai-bug-reporter”. Stay in the chat where the bug happened.

Community-reported UI (not a product spec): Skills & connectors → add skill; Customize > Skills.

This project does **not** claim listing in an official xAI skill store.

### Android (and iOS)

Skills are account-scoped. Install once, then use in the Grok app chat.

- Open Skills in the Grok app and upload `SKILL.md` or the zip, **or**
- Install on grok.com while signed into the same account.

Do not invent exact Android Settings labels. Bash scripts do not run in Chat; the `SKILL.md` body is enough.

---

## Companion web desk

Live desk: **[xAI Bug Reporter](https://finecomputer14451.github.io/xai-bug-reporter/)**

Fallback UI if you are not in Grok Chat. It collects reporter email, subscription tier, and browser/OS system information, then copies, emails, or downloads a paste-ready **Report an issue** package.

GitHub Pages publishes [`docs/`](docs/) via [Deploy GitHub Pages](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/deploy-pages.yml).

**First-time enable (required once):** [Settings → Pages](https://github.com/FineComputer14451/xai-bug-reporter/settings/pages) → **Source: GitHub Actions**. Then re-run the **Deploy GitHub Pages** workflow (Actions → workflow_dispatch, or push to `docs/`).

- Public page: [`docs/`](docs/)
- Grok Build source: [`web/`](web/)

---

## Grok Build (CLI)

Grok Build loads a directory that contains `SKILL.md`. The folder name **must** be `xai-bug-reporter` (matches `name` in `SKILL.md`).

**User-wide** (every project):

```bash
git clone https://github.com/FineComputer14451/xai-bug-reporter.git ~/.grok/skills/xai-bug-reporter
grok inspect | grep xai-bug-reporter
```

**This repo:** `.grok/skills/xai-bug-reporter/` is a real copy of `SKILL.md`, `assets/`, `references/`, and `scripts/` (not symlinks), so `grok` started in the clone picks it up as a project skill and GitHub Download ZIP stays upload-safe.

**Another project** (copy files — do not `ln -s` into a git tree; skill hosts reject zip members that are symlinks):

```bash
mkdir -p /path/to/project/.grok/skills/xai-bug-reporter
cp -R /path/to/xai-bug-reporter/SKILL.md \
      /path/to/xai-bug-reporter/assets \
      /path/to/xai-bug-reporter/references \
      /path/to/xai-bug-reporter/scripts \
      /path/to/project/.grok/skills/xai-bug-reporter/
```

Then in Grok Build:

- `/xai-bug-reporter`
- `/skills` → xai-bug-reporter
- `/config-agents` → xai-bug-reporter, or `grok --agent xai-bug-reporter`
- Auto-invoke on “report a bug”, “reach a human”, “xAI support”, …

Scripts are committed executable (`100755`). Examples below use `bash scripts/…` from the **skill directory**, which works even if `+x` was lost on copy. `prepare-submission.sh` also invokes sibling scripts via `bash` for the same reason.

Optional: restore the executable bit after a copy that dropped it:

```bash
chmod +x ~/.grok/skills/xai-bug-reporter/scripts/*.sh
```

---

## Why this skill exists

xAI’s public path for product bugs is:

1. **Report an issue** inside Grok (Web / iOS / Android)
2. For billing: reply to the **receipt / invoice email**

There is **no public bug-submission API**. This skill automates everything *up to* a validated paste package, then hands the user clear in-product steps.

Canonical reference: [xAI FAQ — How do I report a bug or reach a human?](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human)

### Community hangouts (not tickets)

These are public Discord servers. They do **not** file a bug report.

| Server | For | Invite |
|--------|-----|--------|
| **Grok Community** | grok.com / iOS / Android users | https://discord.gg/kqCc86jM55 |
| **xAI API Discord** | API / developer community | https://discord.gg/x-ai |

Product bugs still go through in-product **Report an issue**. API bugs still go to **support@x.ai**. Cite only these two Discord URLs.

---

## Features

Chat (grok.com / iOS / Android) follows `SKILL.md` only and **must not run scripts**. Bash helpers in `scripts/` are optional CLI for Grok Build / local use.

| Area | What you get |
|------|----------------|
| **In-chat activation** | Works *inside* the conversation where the bug happened — no forced new chat |
| **Conversational collection** | One or two questions at a time; infer Platform from the current Chat client when obvious |
| **Formal triage** | Severity (Critical/High/Medium/Low), category, impact statement |
| **Platform collection** | Ask the user for device / OS / app or browser version |
| **Share-link pipeline** | Structural host + share-id check only (no curl) |
| **Field enforcement** | Required fields must be present before “ready to submit” |
| **Paste-ready package** | Assemble the BEGIN/END block in this chat |
| **Hard boundaries** | Never invent unofficial inboxes; no ticket-filing claims; never run bash in Chat |

---

## Activation (for agents)

Triggers automatically on phrases such as:

- “report a bug” / “report an issue”
- “reach a human” / “contact xAI” / “xAI support”
- “this is broken” / “something went wrong”
- “billing issue” / “subscription problem”
- “help me report this” / “file a ticket”

Explicit:

```text
Activate xai-bug-reporter
use xai-bug-reporter
/xai-bug-reporter
```

**In-chat rule:** if the failure happened in the *current* thread, stay there. Treat this conversation as primary evidence and help produce a share link for *this* chat. Ask one or two questions at a time.

---

## Typical agent flow

On grok.com / iOS / Android, follow `SKILL.md` and do not run scripts.

1. Confirm in-chat context (bug here vs elsewhere). Stay in this thread.
2. Infer Platform when obvious (grok.com → Web, iOS app → iOS, Android app → Android).
3. Triage — severity table in `SKILL.md` → confirm Severity + Category + Impact.
4. Evidence — share link of *this* chat (structural id check) and/or a screenshot attached here.
5. Required fields — email, tier, platform, system/app info, description, steps. Ask one or two questions at a time; do not probe the host.
6. Missing-field loop — list gaps; do not emit a complete report until required fields exist.
7. Assemble — fill the paste template in this chat.
8. Hand off — paste-ready block + ⋮ **Report an issue** (billing: receipt email).

---

## Scripts (optional CLI)

Not used in Chat. Grok Build / local developers may run these with `bash scripts/…`.

| Script | Purpose |
|--------|---------|
| `scripts/score-severity.sh` | Suggest Critical / High / Medium / Low from description keywords |
| `scripts/collect-platform-info.sh` | OS, kernel, arch, browsers, GPU (`--json` optional) |
| `scripts/parse-share-link.sh` | Extract host, path, share id from Grok/xAI URLs (`--json` optional) |
| `scripts/validate-share-link.sh` | Structural + live HTTP check (`--offline`, `--json`) |
| `scripts/validate-report.sh` | Required + preferred field checks; exit 0 only when complete |
| `scripts/assemble-report.sh` | Build paste-ready report from `KEY=VALUE` file or env |
| `scripts/prepare-submission.sh` | Full pipeline: assemble → validate → optional share check → instructions |
| `scripts/pack-skill.sh` | Pack consumer zip (`dist/xai-bug-reporter.zip`) — no `scripts/` |

### Quick CLI examples

```bash
# Severity suggestion
echo "app freezes every time I open the share menu" | bash scripts/score-severity.sh

# Platform snapshot
bash scripts/collect-platform-info.sh
bash scripts/collect-platform-info.sh --json

# Share link
bash scripts/parse-share-link.sh "https://grok.com/share/abc123"
bash scripts/validate-share-link.sh --offline "https://grok.com/share/abc123"
bash scripts/validate-share-link.sh "https://x.com/i/grok/share/xyz"   # live check

# Full package
cp assets/report.env.example report.env
# edit report.env
bash scripts/prepare-submission.sh report.env

# Consumer zip for grok.com / Android / iOS
bash scripts/pack-skill.sh
# → dist/xai-bug-reporter.zip
```

---

## Required fields

Always collect (or confirm) before declaring the report ready:

- Account email
- Subscription tier (Free, SuperGrok, SuperGrokPro, …)
- Platform (Web / iOS / Android)
- System & app info (OS, device model, Grok app or browser version)
- Clear description of the problem
- Evidence: conversation **share link** with a nonempty share id (especially of the current chat) **or** screenshot
- Product, Surface, and Submit-via path
- Billing / credits only: invoice / receipt number **and** purchase channel

Strongly preferred (do not block READY): steps to reproduce.

Platform tips:

- **Web** — exact browser version + relevant extensions
- **iOS / Android** — device model, full OS build, Grok app version
- **In-chat bugs** — share link of *this* conversation is the highest-value evidence

---

## Hard rules

- Prefer in-product **Report an issue**. Billing: reply to the receipt email (refunds: [accounts.x.ai/refund](https://accounts.x.ai/refund)).
- Cite only documented channels (`references/official-process.md`). Never invent emails, extra Discord servers, phones, or unofficial portals. Discord hangouts are not a ticket.
- **support@x.ai** is documented for **xAI API** bugs only ([debugging](https://docs.x.ai/developers/debugging)), not as a general Grok-app inbox.
- Never invent or alter share URLs.
- Never claim a ticket was filed on xAI servers (no public submission API).
- Never force the user to leave the chat where the bug occurred in order to report it.
- Automated severity is a **suggestion** only — confirm with the user.

---

## Repository layout

```
xai-bug-reporter/
├── SKILL.md                      # Chat skill (instructions + frontmatter)
├── AGENTS.md                     # Grok Build project rules
├── README.md
├── LICENSE
├── docs/                         # GitHub Pages site (https://finecomputer14451.github.io/xai-bug-reporter/)
├── web/                          # Grok Build companion desk source
├── .grok/skills/xai-bug-reporter/  # Project skill + supporting files
├── .grok/agents/                 # Grok Build agent + supporting files
│   ├── xai-bug-reporter.md
│   ├── REFERENCES.md
│   └── HANDOFF-TEMPLATES.md
├── .github/
│   ├── dependabot.yml            # Weekly Actions updates
│   └── workflows/validate.yml
├── assets/
│   ├── report-checklist.md       # Human-facing template
│   └── report.env.example        # KEY=VALUE sample for scripts
├── references/
│   ├── official-process.md       # Canonical process notes (rechecked 2026-09-02)
│   ├── triage-protocol.md        # Severity table + categories
│   ├── share-link-guide.md       # How to create / validate share links
│   ├── submission-guide.md       # Automation boundaries
│   ├── question-bank.md          # First pairs per product family
│   ├── report-checklist.md       # Paste twin (also in assets/)
│   ├── report.env.example        # Field crib (CLI twin in assets/)
│   └── LICENSE
├── scripts/
│   ├── assemble-report.sh
│   ├── collect-platform-info.sh
│   ├── parse-share-link.sh
│   ├── pack-skill.sh             # Consumer zip (no scripts/)
│   ├── prepare-submission.sh
│   ├── score-severity.sh
│   ├── validate-report.sh
│   └── validate-share-link.sh
├── dist/                         # generated: xai-bug-reporter.zip
└── tests/
    └── smoke.sh                  # Empty values + share-id checks
```

---

## CI & Dependabot

**CI** runs on every push and pull request to `main` (and via **workflow_dispatch**):

- Required files present
- `SKILL.md` frontmatter checks
- `bash -n` on all scripts
- Smoke tests: severity scoring, share-link parse/validate (share id required), assemble + validate-report (empty values rejected), `tests/smoke.sh`, platform collection, consumer zip (`pack-skill.sh`; archive must include `SKILL.md` and must not contain `scripts/`)

See [Actions → Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml).

**Dependabot** (`.github/dependabot.yml`) opens weekly PRs for GitHub Actions updates (`actions/checkout`, etc.). This repo has no npm/pip package ecosystems.

---

## Legal Disclaimer

**Independent project.** The **xai-bug-reporter** skill is an independent, community-oriented project. It is **not affiliated with, endorsed by, sponsored by, or officially connected to xAI** in any way.

**Trademarks.** **Grok**, **Grok Build**, **Grok Imagine**, **xAI**, and related names, logos, and marks are trademarks or registered trademarks of their respective owners. Use of these names is for identification and descriptive purposes only and does not imply any endorsement or official relationship.

**No official status.** This skill does not represent xAI, does not speak for xAI support or engineering, and does not provide official customer support. It only helps users prepare materials for the publicly documented support channels (in-product **Report an issue** and billing receipt email).

**No submission authority.** There is no public xAI bug-submission API. This skill **does not** file tickets, open cases, or transmit reports to xAI on the user’s behalf. The user remains solely responsible for submitting any report through official product UI or email paths.

**No warranty.** The software and documentation are provided “AS IS”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from use of the skill or reliance on its guidance.

**Accuracy of process notes.** References to xAI’s FAQ and product flows are based on publicly available documentation at the time of writing. Official processes may change; users should verify current instructions in the product and on [docs.x.ai](https://docs.x.ai).

**License.** Use of this repository is governed by the [MIT License](LICENSE).

---

## License

[MIT](LICENSE) © 2026 FineComputer14451
