# xai-bug-reporter

Grok skill for the **official xAI / Grok bug-reporting process**.

Helps agents collect triage fields, platform info, and conversation share links, validate evidence, and produce a paste-ready package for the in-product **Report an issue** flow (and billing receipt-email path). There is no public xAI bug-submission API — automation stops at a validated paste package.

[![Validate skill](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml/badge.svg)](https://github.com/FineComputer14451/xai-bug-reporter/actions/workflows/validate.yml)

## Install

```bash
cp -a . ~/.grok/skills/xai-bug-reporter
# or
cp -a . /home/workdir/.grok/skills/xai-bug-reporter
```

The skill directory name must remain `xai-bug-reporter` (matches `name` in `SKILL.md`).

## Layout

```
xai-bug-reporter/
├── SKILL.md
├── assets/
│   ├── report-checklist.md
│   └── report.env.example
├── references/
│   ├── official-process.md
│   ├── share-link-guide.md
│   ├── submission-guide.md
│   └── triage-protocol.md
└── scripts/
    ├── assemble-report.sh
    ├── collect-platform-info.sh
    ├── parse-share-link.sh
    ├── prepare-submission.sh
    ├── score-severity.sh
    ├── validate-report.sh
    └── validate-share-link.sh
```

## Quick use

```bash
# severity suggestion
echo "images fail every time" | bash scripts/score-severity.sh

# platform snapshot
bash scripts/collect-platform-info.sh

# share link parse + validation
bash scripts/parse-share-link.sh "https://grok.com/share/..."
bash scripts/validate-share-link.sh --offline "https://grok.com/share/..."

# assemble + pre-submit package
cp assets/report.env.example report.env
# edit report.env
bash scripts/prepare-submission.sh report.env
```

## CI

GitHub Actions runs on every push and PR to `main`:

- Required file presence
- SKILL.md frontmatter checks
- `bash -n` syntax on all scripts
- Smoke tests for score-severity, parse/validate share links, assemble + validate-report, collect-platform-info

## Official support path

1. Use **Report an issue** in the Grok product (Web / iOS / Android)
2. For billing, reply to the receipt / invoice email

See [xAI FAQ](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human).

## License

MIT
