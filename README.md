# xai-bug-reporter

Grok skill for the **official xAI / Grok bug-reporting process**.

Helps agents collect triage fields, platform info, and conversation share links, validate evidence, and produce a paste-ready package for the in-product **Report an issue** flow (and billing receipt-email path). There is no public xAI bug-submission API — automation stops at a validated paste package.

## Install

```bash
cp -a . ~/.grok/skills/xai-bug-reporter
```

The skill directory name must remain `xai-bug-reporter` (matches `name` in `SKILL.md`).

## Official support path

1. Use **Report an issue** in the Grok product (Web / iOS / Android)
2. For billing, reply to the receipt / invoice email

See [xAI FAQ](https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human).

## License

MIT
