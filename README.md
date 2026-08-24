# xai-bug-reporter

**Grok skill** that encodes the official xAI / Grok bug-reporting and human-support process.

It guides agents (and users) through formal triage, evidence collection, platform info, share-link validation, and a paste-ready report for the in-product **Report an issue** flow — without inventing support channels or claiming to file tickets on xAI servers.

**Web app:** [xAI Bug Reporter](https://finecomputer14451.github.io/xai-bug-reporter) — structured desk for email, subscription tier, system info, and a paste-ready package.

[![Web app](https://img.shields.io/badge/web_app-live-0C0C0D?logo=github&logoColor=white)](https://finecomputer14451.github.io/xai-bug-reporter)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-live-222?logo=githubpages&logoColor=white)](https://finecomputer14451.github.io/xai-bug-reporter/)
[![Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](https://github.com/FineComputer14451/xai-bug-reporter/network/updates)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Shell](https://img.shields.io/badge/shell-bash-4EAA25?logo=gnubash&logoColor=white)](#scripts)
[![Last commit](https://img.shields.io/github/last-commit/FineComputer14451/xai-bug-reporter)](https://github.com/FineComputer14451/xai-bug-reporter/commits/main)

> **Note**  
> Independent project — **not affiliated with, endorsed by, sponsored by, or officially connected to xAI**. See [Legal Disclaimer](#legal-disclaimer).

---

## Web app

Open the live desk: **[xAI Bug Reporter](https://finecomputer14451.github.io/xai-bug-reporter)**

Companion UI for this skill. It collects reporter email, subscription tier, and browser/OS system information, then copies, emails, or downloads a paste-ready **Report an issue** package.

- Public page: [`docs/`](docs/)
- Grok Build source: [`web/`](web/)

---

## Install

### grok.com (web)

Official: Skills are on grok.com; create by conversation, upload a file, or Skill Creator. [grok.com/skills](https://grok.com/skills)

1. Upload this repo’s [`SKILL.md`](https://github.com/FineComputer14451/xai-bug-reporter/blob/main/SKILL.md) (use **Raw** to download), or the zip from `bash scripts/pack-skill.sh` (`dist/xai-bug-reporter.zip`).
2. Ask Skill Creator to save it as skill `xai-bug-reporter`.
3. Invoke with “report a bug” / “use xai-bug-reporter”.

Community-reported UI (not a product spec): Skills & connectors → add skill; Customize > Skills.

This project does **not** claim listing in an official xAI skill store.

### Android (and iOS)

Skills are account-scoped and available on grok.com, iOS, and Android ([Grok Skills](https://x.ai/news/grok-skills)).

- Open Skills in the Grok app and upload `SKILL.md` or the zip, **or**
- Install on grok.com while signed into the same account.

Do not invent exact Android Settings labels. Bash scripts do not run in the Grok app; the `SKILL.md` body is enough.

### Grok Build (CLI)

Grok Build loads a directory that contains `SKILL.md`. The folder name **must** be `xai-bug-reporter` (matches `name` in `SKILL.md`).

**User-wide** (every project):

```bash
git clone https://github.com/FineComputer14451/xai-bug-reporter.git
ln -sfn "$(pwd)/xai-bug-reporter" ~/.grok/skills/xai-bug-reporter
grok inspect | grep xai-bug-reporter
```

**This repo:** `.grok/skills/xai-bug-reporter/` is already linked, so `grok` started in the clone picks it up as a project skill.

**Another project:**

```bash
mkdir -p /path/to/project/.grok/skills
ln -sfn /path/to/xai-bug-reporter /path/to/project/.grok/skills/xai-bug-reporter
```

Then in Grok Build:

- `/xai-bug-reporter`
- `/skills` → xai-bug-reporter
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

---

## Features

Bash helpers (`scripts/*.sh`) are **Grok Build optional**. On grok.com / iOS / Android the agent follows `SKILL.md` only and must not run those scripts.

| Area | What you get |
|------|----------------|
| **In-chat activation** | Works *inside* the conversation where the bug happened — no forced new chat |
| **Formal triage** | Severity (Critical/High/Medium/Low), category, impact statement |
| **Automated severity scoring** | Keyword suggestion via `score-severity.sh` (**Grok Build optional**; always confirm with user) |
| **Platform collection** | Ask the user for device / OS / app version; Grok Build may run `collect-platform-info.sh` |
| **Share-link pipeline** | Structural host + share-id check; Grok Build may add live HTTP validation |
| **Field enforcement** | Required fields must be present before “ready to submit” |
| **Paste-ready package** | Assemble the BEGIN/END block in chat; Grok Build: `assemble-report.sh` + `prepare-submission.sh` |
| **Hard boundaries** | Never invent unofficial inboxes; no ticket-filing claims |

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
/xai-bug-reporter
```

**In-chat rule:** if the failure happened in the *current* thread, stay there. Treat this conversation as primary evidence and help produce a share link for *this* chat.

---

## Typical agent flow

On grok.com / iOS / Android, follow `SKILL.md` and do not run scripts. On Grok Build you may use the helpers below.

1. Confirm in-chat context (bug here vs elsewhere).
2. Triage — severity table in `SKILL.md` (Grok Build: `score-severity.sh`) → confirm Severity + Category + Impact.
3. Evidence — share link of the failing chat (structural id check; Grok Build: `parse-share-link.sh` + `validate-share-link.sh`) and/or screenshot.
4. Required fields — email, tier, platform, system/app info, description, steps. Ask the user; do not probe the host on grok.com / mobile.
5. Missing-field loop — list gaps; do not emit a complete report until required fields exist.
6. Assemble & validate — fill the paste template (Grok Build: `prepare-submission.sh` or assemble + `validate-report.sh`).
7. Hand off — paste-ready block + exact **Report an issue** steps (billing: receipt email).

---

## Scripts

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
- Billing only: invoice / receipt number

Strongly preferred (do not block READY): steps to reproduce.

Platform tips:

- **Web** — exact browser version + relevant extensions
- **iOS / Android** — device model, full OS build, Grok app version
- **In-chat bugs** — share link of *this* conversation is the highest-value evidence

---

## Hard rules

- Prefer in-product **Report an issue**. Billing: reply to the receipt email (refunds: [accounts.x.ai/refund](https://accounts.x.ai/refund)).
- Cite only documented channels (`references/official-process.md`). Never invent emails, Discord, phones, or unofficial portals.
- **support@x.ai** is documented for **xAI API** bugs only ([debugging](https://docs.x.ai/developers/debugging)), not as a general Grok-app inbox.
- Never invent or alter share URLs.
- Never claim a ticket was filed on xAI servers (no public submission API).
- Never force the user to leave the chat where the bug occurred in order to report it.
- Automated severity is a **suggestion** only — confirm with the user.

---

## Repository layout

```
xai-bug-reporter/
├── SKILL.md                      # Agent instructions + frontmatter
├── README.md
├── LICENSE
├── docs/                         # GitHub Pages site (https://finecomputer14451.github.io/xai-bug-reporter/)
├── web/                          # Grok Build companion desk source
├── .grok/skills/xai-bug-reporter/  # Grok Build project skill (symlinks)
├── .github/
│   ├── dependabot.yml            # Weekly Actions updates
│   └── workflows/validate.yml
├── assets/
│   ├── report-checklist.md       # Human-facing template
│   └── report.env.example        # KEY=VALUE sample for scripts
├── references/
│   ├── official-process.md       # Canonical process notes
│   ├── triage-protocol.md        # Severity table + categories
│   ├── share-link-guide.md       # How to create / validate share links
│   └── submission-guide.md       # Automation boundaries
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
