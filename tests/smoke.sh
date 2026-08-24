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

# Filled identity fields, no evidence: evidence is required → incomplete
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
expect_rc_and 1 'STATUS: INCOMPLETE' "screenshot=no and empty share is incomplete" \
  assembled_validate "$tmpdir/required-only.env"

cat >"$tmpdir/required-plus-shot.env" <<'EOF'
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
SCREENSHOT=yes
EOF
expect_rc_and 0 'PREFERRED missing' "screenshot counts as evidence; steps still preferred" \
  assembled_validate "$tmpdir/required-plus-shot.env"

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

expect_rc 1 "prepare fails without share or screenshot" \
  prepare "$tmpdir/required-only.env"

expect_rc 0 "prepare succeeds with screenshot evidence and empty share" \
  prepare "$tmpdir/required-plus-shot.env"

ran=$((ran + 1))
set +e
prep_out=$(prepare "$tmpdir/required-plus-shot.env" 2>&1)
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

# --- project skill must be a real symlink, not a path-text blob ---
proj="$ROOT/.grok/skills/xai-bug-reporter"
ran=$((ran + 1))
if [[ ! -L "$proj/SKILL.md" ]]; then
  fail=$((fail + 1))
  echo "FAIL project SKILL.md is not a symlink"
elif ! grep -q '^name: xai-bug-reporter$' "$proj/SKILL.md"; then
  fail=$((fail + 1))
  echo "FAIL project SKILL.md does not resolve to skill frontmatter"
else
  echo "OK   project SKILL.md is a symlink to the real skill"
fi

ran=$((ran + 1))
if [[ ! -L "$proj/scripts" || ! -d "$proj/scripts" ]]; then
  fail=$((fail + 1))
  echo "FAIL project scripts/ is not a symlink to a directory"
elif [[ ! -f "$proj/scripts/score-severity.sh" ]]; then
  fail=$((fail + 1))
  echo "FAIL project scripts/ does not contain score-severity.sh"
else
  echo "OK   project scripts/ is a symlink to helpers"
fi

# --- consumer zip: SKILL.md present, no scripts/ ---

expect_rc 0 "pack-skill.sh succeeds" \
  bash "$SCRIPTS/pack-skill.sh"

ZIP="$ROOT/dist/xai-bug-reporter.zip"
ran=$((ran + 1))
if [[ ! -f "$ZIP" ]]; then
  fail=$((fail + 1))
  echo "FAIL consumer zip missing at $ZIP"
else
  echo "OK   consumer zip exists"
fi

zip_list() {
  if command -v unzip >/dev/null 2>&1; then
    unzip -l "$1"
  else
    python3 - "$1" <<'PY'
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as zf:
    for name in zf.namelist():
        print(name)
PY
  fi
}

zip_extract() {
  if command -v unzip >/dev/null 2>&1; then
    unzip -p "$1" "$2"
  else
    python3 - "$1" "$2" <<'PY'
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as zf:
    sys.stdout.write(zf.read(sys.argv[2]).decode())
PY
  fi
}

ran=$((ran + 1))
listing=$(zip_list "$ZIP" 2>&1 || true)
if ! echo "$listing" | grep -q -- 'xai-bug-reporter/SKILL.md'; then
  fail=$((fail + 1))
  echo "FAIL zip missing xai-bug-reporter/SKILL.md"
  echo "$listing" | head -20
else
  echo "OK   zip contains xai-bug-reporter/SKILL.md"
fi

ran=$((ran + 1))
if echo "$listing" | grep -q -- 'scripts/'; then
  fail=$((fail + 1))
  echo "FAIL zip listing contains scripts/"
  echo "$listing" | head -40
else
  echo "OK   zip does not contain scripts/"
fi

ran=$((ran + 1))
if ! echo "$listing" | grep -q -- 'xai-bug-reporter/references/official-process.md'; then
  fail=$((fail + 1))
  echo "FAIL zip missing references/official-process.md"
else
  echo "OK   zip contains official-process.md"
fi

ran=$((ran + 1))
skill_body=$(zip_extract "$ZIP" xai-bug-reporter/SKILL.md 2>/dev/null || true)
if ! echo "$skill_body" | grep -q -- 'NEVER run bash'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md missing consumer NEVER-run-scripts instruction"
else
  echo "OK   packed SKILL.md tells consumer hosts NEVER run scripts"
fi

ran=$((ran + 1))
if echo "$skill_body" | grep -q -- 'Always run helpers'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md 'Always run helpers' can leak bash onto grok.com"
else
  echo "OK   packed SKILL.md does not say Always run helpers"
fi

ran=$((ran + 1))
compat=$(echo "$skill_body" | grep -E '^compatibility:' || true)
if echo "$compat" | grep -qi -- 'Requires bash'; then
  fail=$((fail + 1))
  echo "FAIL packed compatibility requires bash"
  echo "$compat"
else
  echo "OK   packed compatibility does not require bash"
fi

ran=$((ran + 1))
share_guide=$(zip_extract "$ZIP" xai-bug-reporter/references/share-link-guide.md 2>/dev/null || true)
if echo "$share_guide" | grep -q -- 'Always run `scripts/'; then
  fail=$((fail + 1))
  echo "FAIL packed share-link-guide tells hosts to Always run scripts"
else
  echo "OK   packed share-link-guide does not Always run scripts"
fi

echo
if [[ "$fail" -ne 0 ]]; then
  echo "$fail/$ran FAILED"
  exit 1
fi
echo "$ran/$ran passed"
exit 0
