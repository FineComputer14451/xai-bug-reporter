# xai-bug-reporter

**Grok skill** that encodes the official xAI / Grok bug-reporting and human-support process.

It guides agents (and users) through formal triage, evidence collection, platform info, share-link validation, and a paste-ready report for the in-product **Report an issue** flow — without inventing support channels or claiming to file tickets on xAI servers.

[![Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](https://github.com/FineComputer14451/xai-bug-reporter/network/updates)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Shell](https://img.shields.io/badge/shell-bash-4EAA25?logo=gnubash&logoColor=white)](#scripts)
[![Last commit](https://img.shields.io/github/last-commit/FineComputer14451/xai-bug-reporter)](https://github.com/FineComputer14451/xai-bug-reporter/commits/main)

---

## Why this skill exists

xAI’s public path for product bugs is:

1. **Report an issue** inside Grok (Web / iOS / Android)
2. For billing: reply to the **receipt / invoice email**

There is **no public bug-submission API**. This skill automates everything *up to* a validated paste package, then hands the user clear in-product steps.

Canonical reference: [xAI FAQ — How do I report a bug or reach a human?](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human)

---

## Features

| Area | What you get |
|------|----------------|
| **In-chat activation** | Works *inside* the conversation where the bug happened — no forced new chat |
| **Formal triage** | Severity (Critical/High/Medium/Low), category, impact statement |
| **Automated severity scoring** | Keyword-based suggestion via `score-severity.sh` (always confirm with user) |
| **Platform collection** | OS, kernel, GPU, browsers (`collect-platform-info.sh`, human or `--json`) |
| **Share-link pipeline** | Parse + structural/live validation for `grok.com/share/...` and `x.com/i/grok/share/...` |
| **Field enforcement** | Required fields must be present before “ready to submit” |
| **Paste-ready package** | `assemble-report.sh` + `prepare-submission.sh` → BEGIN/END report block |
| **Hard boundaries** | Never invent emails, Discord, or claim a ticket was filed |

---

## Install

Clone or copy into your Grok skills directory. The folder name **must** be `xai-bug-reporter` (matches `name` in `SKILL.md`).

```bash
# From this repo
git clone https://github.com/FineComputer14451/xai-bug-reporter.git
cp -a xai-bug-reporter ~/.grok/skills/

# Or into a project skills path
cp -a xai-bug-reporter /path/to/.grok/skills/
```

Optional: make scripts executable:

```bash
chmod +x ~/.grok/skills/xai-bug-reporter/scripts/*.sh
```

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
```

**In-chat rule:** if the failure happened in the *current* thread, stay there. Treat this conversation as primary evidence and help produce a share link for *this* chat.

---

## Typical agent flow

1. Confirm in-chat context (bug here vs elsewhere).
2. Triage — `score-severity.sh` → confirm Severity + Category + Impact.
3. Evidence — share link of the failing chat (`parse-share-link.sh` + `validate-share-link.sh`) and/or screenshot.
4. Required fields — email, tier, platform, system/app info, description, steps.
5. Missing-field loop — list gaps; do not emit a complete report until required fields exist.
6. Assemble & validate — `prepare-submission.sh` or assemble + `validate-report.sh`.
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
```

---

## Required fields

Always collect (or confirm) before declaring the report ready:

- Account email
- Subscription tier (Free, SuperGrok, SuperGrokPro, …)
- Platform (Web / iOS / Android)
- System & app info (OS, device model, Grok app or browser version)
- Clear description of the problem
- Steps to reproduce (strongly preferred)
- Evidence: conversation **share link** (especially of the current chat) **or** screenshot
- Billing only: invoice / receipt number

Platform tips:

- **Web** — exact browser version + relevant extensions
- **iOS / Android** — device model, full OS build, Grok app version
- **In-chat bugs** — share link of *this* conversation is the highest-value evidence

---

## Hard rules

- Prefer in-product **Report an issue**; billing may also use the receipt email.
- Never invent support emails, Discord servers, phone numbers, or unofficial portals.
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
└── scripts/
    ├── assemble-report.sh
    ├── collect-platform-info.sh
    ├── parse-share-link.sh
    ├── prepare-submission.sh
    ├── score-severity.sh
    ├── validate-report.sh
    └── validate-share-link.sh
```

---

## CI & Dependabot

**CI** runs on every push and pull request to `main` (and via **workflow_dispatch**):

- Required files present
- `SKILL.md` frontmatter checks
- `bash -n` on all scripts
- Smoke tests: severity scoring, share-link parse/validate, assemble + validate-report, platform collection

See [Actions → Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml).

**Dependabot** (`.github/dependabot.yml`) opens weekly PRs for GitHub Actions updates (`actions/checkout`, etc.). This repo has no npm/pip package ecosystems.

---

## License

[MIT](LICENSE) © 2026 FineComputer14451
