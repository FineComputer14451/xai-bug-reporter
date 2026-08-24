#!/usr/bin/env bash
# Behavioral smokes for report validation and share-link structure.
# Usage: bash tests/smoke.sh

set -u

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
SCRIPTS="$ROOT/scripts"
fail=0
ran=0

expect_rc() {
  local want="$1"
  local name="$2"
  shift 2
  ran=$((ran + 1))
  set +e
  local out
  out=$("$@" 2>&1)
  local got=$?
  set -e
  if [[ "$got" -ne "$want" ]]; then
    fail=$((fail + 1))
    echo "FAIL $name (rc=$got want=$want)"
    echo "$out" | head -20
    return 0
  fi
  echo "OK   $name (rc=$got)"
}

expect_rc_and() {
  local want="$1"
  local needle="$2"
  local name="$3"
  shift 3
  ran=$((ran + 1))
  set +e
  local out
  out=$("$@" 2>&1)
  local got=$?
  set -e
  if [[ "$got" -ne "$want" ]]; then
    fail=$((fail + 1))
    echo "FAIL $name (rc=$got want=$want)"
    echo "$out" | head -20
    return 0
  fi
  if ! echo "$out" | grep -qE "$needle"; then
    fail=$((fail + 1))
    echo "FAIL $name (missing /$needle/)"
    echo "$out" | head -20
    return 0
  fi
  echo "OK   $name (rc=$got)"
}

parse_share() { bash "$SCRIPTS/parse-share-link.sh" "$@"; }
check_share() { bash "$SCRIPTS/validate-share-link.sh" "$@"; }
prepare() { bash "$SCRIPTS/prepare-submission.sh" "$@"; }
assembled_validate() {
  bash "$SCRIPTS/assemble-report.sh" "$1" | bash "$SCRIPTS/validate-report.sh"
}

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# --- empty / whitespace values must not be READY TO SUBMIT ---

: >"$tmpdir/empty.env"
expect_rc 1 "empty assemble is incomplete" \
  assembled_validate "$tmpdir/empty.env"

cat >"$tmpdir/blank.env" <<'EOF'
SEVERITY=
CATEGORY=
IMPACT=
ACCOUNT_EMAIL=
SUBSCRIPTION_TIER=
PLATFORM=
SYSTEM_INFO=
DESCRIPTION=
STEPS=
SHARE_LINK=
SCREENSHOT=
EOF
expect_rc_and 1 'STATUS: INCOMPLETE' "blank KEY=VALUE assemble is incomplete" \
  assembled_validate "$tmpdir/blank.env"

cat >"$tmpdir/spaces.env" <<'EOF'
SEVERITY=   
CATEGORY=   
IMPACT=   
ACCOUNT_EMAIL=   
SUBSCRIPTION_TIER=   
PLATFORM=   
SYSTEM_INFO=   
DESCRIPTION=   
EOF
expect_rc 1 "whitespace-only required fields are incomplete" \
  assembled_validate "$tmpdir/spaces.env"

# Filled required fields, no evidence: required OK, preferred missing, still exit 0
cat >"$tmpdir/required-only.env" <<'EOF'
SEVERITY=High
CATEGORY=UI
IMPACT=Cannot open share menu
ACCOUNT_EMAIL=ci@example.com
SUBSCRIPTION_TIER=SuperGrokPro
PLATFORM=Web
SYSTEM_INFO=Ubuntu CI
DESCRIPTION=Share menu freezes
STEPS=
SHARE_LINK=
SCREENSHOT=no
EOF
expect_rc_and 0 'PREFERRED missing' "required values pass; screenshot=no is not evidence" \
  assembled_validate "$tmpdir/required-only.env"

expect_rc_and 0 'STATUS: READY TO SUBMIT' "example env still complete" \
  assembled_validate "$ROOT/assets/report.env.example"

# --- share id required ---

expect_rc 1 "parse grok.com/ (no share id)" \
  parse_share "https://grok.com/"
expect_rc 1 "parse grok.com/share/ (empty id)" \
  parse_share "https://grok.com/share/"
expect_rc 1 "parse x.com without share id" \
  parse_share "https://x.com/i/grok/"
expect_rc 0 "parse grok.com/share/<id>" \
  parse_share "https://grok.com/share/ci-test-id-123"
expect_rc 0 "parse x.com/i/grok/share/<id>" \
  parse_share "https://x.com/i/grok/share/abcXYZ"

expect_rc 1 "offline validate grok.com/ (no share id)" \
  check_share --offline "https://grok.com/"
expect_rc 1 "offline validate grok.com/share/ (empty id)" \
  check_share --offline "https://grok.com/share/"
expect_rc 1 "offline validate unknown host" \
  check_share --offline "https://example.com/nope"
expect_rc 0 "offline validate grok.com/share/<id>" \
  check_share --offline "https://grok.com/share/ci-test-id-123"

# --- prepare must not succeed on an invalid share URL ---

cat >"$tmpdir/bad-share.env" <<'EOF'
SEVERITY=High
CATEGORY=UI
IMPACT=Cannot open share menu
ACCOUNT_EMAIL=ci@example.com
SUBSCRIPTION_TIER=SuperGrokPro
PLATFORM=Web
SYSTEM_INFO=Ubuntu CI
DESCRIPTION=Share menu freezes
STEPS=1. Open share
SHARE_LINK=https://example.com/nope
SCREENSHOT=yes
EOF
expect_rc 1 "prepare fails when SHARE_LINK host is not Grok" \
  prepare "$tmpdir/bad-share.env"

expect_rc 0 "prepare succeeds with filled required fields and empty share" \
  prepare "$tmpdir/required-only.env"

ran=$((ran + 1))
set +e
prep_out=$(prepare "$tmpdir/required-only.env" 2>&1)
set -e
if echo "$prep_out" | grep -q 'support@x.ai'; then
  fail=$((fail + 1))
  echo "FAIL Grok handoff must not cite support@x.ai as a general inbox"
elif ! echo "$prep_out" | grep -qi 'receipt'; then
  fail=$((fail + 1))
  echo "FAIL Grok handoff missing receipt-email billing path"
else
  echo "OK   Grok handoff uses receipt email, not support@x.ai"
fi

echo
if [[ "$fail" -ne 0 ]]; then
  echo "$fail/$ran FAILED"
  exit 1
fi
echo "$ran/$ran passed"
exit 0
