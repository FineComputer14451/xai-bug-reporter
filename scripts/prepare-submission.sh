#!/usr/bin/env bash
# Full pipeline: assemble → validate → optional share-link check → paste package.
# Usage: bash scripts/prepare-submission.sh report.env

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

ENV_FILE="${1:-}"
if [[ -z "$ENV_FILE" || ! -f "$ENV_FILE" ]]; then
  echo "Usage: $0 <report.env>"
  echo "See assets/report.env.example"
  exit 1
fi

# Invoke via bash so the pipeline works even when git/fs did not preserve +x.
run_script() {
  bash "$SCRIPT_DIR/$1" "${@:2}"
}

echo "=== 1. Assemble ==="
REPORT=$(run_script assemble-report.sh "$ENV_FILE")
echo "$REPORT"
echo

echo "=== 2. Validate fields ==="
set +e
echo "$REPORT" | run_script validate-report.sh
val_rc=$?
set -e
echo

SHARE=$(grep -E '^SHARE_LINK=' "$ENV_FILE" | cut -d= -f2- | xargs || true)
share_rc=0
if [[ -n "$SHARE" ]]; then
  echo "=== 3. Share-link validation ==="
  set +e
  run_script validate-share-link.sh "$SHARE"
  share_rc=$?
  set -e
  echo
fi

echo "=== 4. Submission instructions ==="
cat <<EOF
Your report package is above.

To submit via the official path:

1. Open (or stay in) the Grok chat — preferably the one where the bug occurred.
2. Tap the three-dots (⋮) menu → "Report an issue" / "Report Issue".
3. Paste the block between -----BEGIN REPORT----- and -----END REPORT-----.
4. Attach a screenshot if available.
5. Submit.

Billing alternative: reply to your receipt email with the same details + invoice number.

Optional hangouts (not a ticket): Grok Community https://discord.gg/kqCc86jM55 · xAI API Discord https://discord.gg/x-ai

This skill does not (and cannot) submit the ticket for you — there is no public xAI bug API.
EOF

if [[ $val_rc -ne 0 ]]; then
  exit "$val_rc"
fi
exit "$share_rc"
