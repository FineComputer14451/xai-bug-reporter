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

# --- no symlinks anywhere (skill hosts reject zip symlink members) ---
proj="$ROOT/.grok/skills/xai-bug-reporter"
ran=$((ran + 1))
worktree_links=""
while IFS= read -r path; do
  if [[ -L "$ROOT/$path" ]]; then
    worktree_links+="$path"$'\n'
  fi
done < <(git -C "$ROOT" ls-files; git -C "$ROOT" ls-files -o --exclude-standard)
if [[ -n "$worktree_links" ]]; then
  fail=$((fail + 1))
  echo "FAIL tracked or unignored worktree paths are symlinks (upload rejects them)"
  echo "$worktree_links" | head -20
else
  echo "OK   tracked and unignored worktree paths are not symlinks"
fi

ran=$((ran + 1))
tracked_links=$(git -C "$ROOT" ls-files -s | awk '$1=="120000"{print}')
if [[ -n "$tracked_links" ]]; then
  fail=$((fail + 1))
  echo "FAIL git index contains symlink mode 120000"
  echo "$tracked_links" | head -20
else
  echo "OK   git index contains no symlink mode 120000"
fi

ran=$((ran + 1))
if [[ ! -f "$proj/SKILL.md" ]]; then
  fail=$((fail + 1))
  echo "FAIL project SKILL.md missing"
elif ! grep -q '^name: xai-bug-reporter$' "$proj/SKILL.md"; then
  fail=$((fail + 1))
  echo "FAIL project SKILL.md missing skill frontmatter"
elif ! cmp -s "$ROOT/SKILL.md" "$proj/SKILL.md"; then
  fail=$((fail + 1))
  echo "FAIL project SKILL.md differs from repo SKILL.md"
else
  echo "OK   project SKILL.md is a regular file matching repo SKILL.md"
fi

ran=$((ran + 1))
if [[ ! -f "$proj/scripts/score-severity.sh" ]]; then
  fail=$((fail + 1))
  echo "FAIL project scripts/score-severity.sh missing"
elif ! diff -rq "$ROOT/assets" "$proj/assets" >/dev/null \
  || ! diff -rq "$ROOT/references" "$proj/references" >/dev/null \
  || ! diff -rq "$ROOT/scripts" "$proj/scripts" >/dev/null; then
  fail=$((fail + 1))
  echo "FAIL project skill assets/references/scripts differ from repo copies"
else
  echo "OK   project skill assets/ references/ scripts/ match repo copies"
fi

ran=$((ran + 1))
agent="$ROOT/.grok/agents/xai-bug-reporter.md"
if [[ ! -f "$ROOT/AGENTS.md" ]]; then
  fail=$((fail + 1))
  echo "FAIL AGENTS.md missing"
elif [[ ! -f "$agent" ]] || ! grep -q '^name: xai-bug-reporter$' "$agent"; then
  fail=$((fail + 1))
  echo "FAIL .grok/agents/xai-bug-reporter.md missing or unnamed"
elif [[ ! -f "$ROOT/.grok/agents/REFERENCES.md" || ! -f "$ROOT/.grok/agents/HANDOFF-TEMPLATES.md" ]]; then
  fail=$((fail + 1))
  echo "FAIL agent supporting files REFERENCES.md / HANDOFF-TEMPLATES.md missing"
else
  echo "OK   agent + supporting files present"
fi

ran=$((ran + 1))
if grep -qE 'SKILL_DIR|MAY run `bash|MAY run bash' \
  "$ROOT/AGENTS.md" \
  "$ROOT/.grok/agents/xai-bug-reporter.md" \
  "$ROOT/.grok/agents/REFERENCES.md" \
  "$ROOT/.grok/agents/HANDOFF-TEMPLATES.md"; then
  fail=$((fail + 1))
  echo "FAIL agent supporting files tell Chat to run bash"
else
  echo "OK   agent supporting files do not tell Chat to run bash"
fi

ran=$((ran + 1))
desk="$ROOT/docs/index.html"
if grep -q 'INBOX' "$desk"; then
  fail=$((fail + 1))
  echo "FAIL companion desk still maps products to invented inboxes"
elif grep -q 'blocker' "$desk"; then
  fail=$((fail + 1))
  echo "FAIL companion desk still uses Blocker instead of Critical"
elif ! grep -q 'Status: ${ready ? "READY"' "$desk"; then
  fail=$((fail + 1))
  echo "FAIL companion desk paste block missing Status READY/INCOMPLETE"
elif ! grep -q 'discord.gg/kqCc86jM55' "$desk" || ! grep -q 'discord.gg/x-ai' "$desk"; then
  fail=$((fail + 1))
  echo "FAIL companion desk missing Discord hangout links"
else
  echo "OK   companion desk matches Chat skill channels and template"
fi

ran=$((ran + 1))
if grep -q 'inbox: "support@x.ai"' "$ROOT/web/src/lib/report.ts" \
  || grep -q 'safety@x.ai' "$ROOT/web/src/lib/report.ts"; then
  fail=$((fail + 1))
  echo "FAIL web report.ts still invents xAI inboxes for Grok products"
elif ! grep -q 'api-email' "$ROOT/web/src/lib/report.ts"; then
  fail=$((fail + 1))
  echo "FAIL web report.ts missing API-only email path"
else
  echo "OK   web companion only emails support@x.ai for API bugs"
fi

# GitHub "Download ZIP" is git archive with a repo-branch prefix.
# grok.com / skill hosts reject any symlink member in that zip.
ran=$((ran + 1))
archive="$tmpdir/git-archive.zip"
# Archive the index (what a commit / GitHub ZIP would contain), not an
# older HEAD that may still have the pre-fix symlinks.
if ! tree=$(git -C "$ROOT" write-tree) || ! git -C "$ROOT" archive --format=zip -o "$archive" "$tree"; then
  fail=$((fail + 1))
  echo "FAIL git archive could not be created"
else
  set +e
  archive_out=$(python3 - "$archive" <<'PY'
import stat
import sys
import zipfile

zf = zipfile.ZipFile(sys.argv[1])
links = []
for info in zf.infolist():
    mode = (info.external_attr >> 16) & 0xFFFF
    if stat.S_ISLNK(mode):
        links.append(info.filename)
if links:
    print("SYMLINKS")
    for name in links:
        print(name)
    sys.exit(1)
print("NONE")
PY
)
  archive_rc=$?
  set -e
  if [[ "$archive_rc" -ne 0 ]]; then
    fail=$((fail + 1))
    echo "FAIL git archive contains symlink members (skill upload rejects them)"
    echo "$archive_out" | head -20
  else
    echo "OK   git archive contains no symlink members"
  fi
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
if echo "$skill_body" | grep -qE 'SKILL_DIR|MAY run `bash|MAY run bash'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md still tells Chat agents to run bash / SKILL_DIR"
else
  echo "OK   packed SKILL.md does not tell Chat agents to run bash"
fi

ran=$((ran + 1))
if ! echo "$skill_body" | grep -q -- 'one or two questions'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md missing Chat conversational collection"
else
  echo "OK   packed SKILL.md collects fields one or two questions at a time"
fi

ran=$((ran + 1))
if ! echo "$skill_body" | grep -q -- 'Stay in this Grok chat'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md missing in-chat Report an issue hand-off"
else
  echo "OK   packed SKILL.md hands off in the current Grok chat"
fi

ran=$((ran + 1))
if ! echo "$skill_body" | grep -q -- 'references/official-process.md'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md does not point at supporting references"
else
  echo "OK   packed SKILL.md points at supporting references"
fi

ran=$((ran + 1))
if ! echo "$skill_body" | grep -q -- 'discord.gg/kqCc86jM55' \
  || ! echo "$skill_body" | grep -q -- 'discord.gg/x-ai'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md missing Grok Community or xAI API Discord invite"
elif echo "$skill_body" | grep -q -- 'No public Discord'; then
  fail=$((fail + 1))
  echo "FAIL packed SKILL.md still denies public Discord hangouts"
else
  echo "OK   packed SKILL.md cites both Discord hangouts (not tickets)"
fi

ran=$((ran + 1))
official_body=$(zip_extract "$ZIP" xai-bug-reporter/references/official-process.md 2>/dev/null || true)
if ! echo "$official_body" | grep -q -- 'discord.gg/kqCc86jM55' \
  || ! echo "$official_body" | grep -q -- 'discord.gg/x-ai'; then
  fail=$((fail + 1))
  echo "FAIL packed official-process.md missing Discord hangout invites"
elif ! echo "$official_body" | grep -q -- 'bug-submission inbox'; then
  fail=$((fail + 1))
  echo "FAIL packed official-process.md does not mark Discord as not a ticket"
else
  echo "OK   packed official-process.md documents Discord hangouts as not tickets"
fi

ran=$((ran + 1))
if ! echo "$listing" | grep -q -- 'xai-bug-reporter/assets/report-checklist.md'; then
  fail=$((fail + 1))
  echo "FAIL zip missing assets/report-checklist.md"
else
  echo "OK   zip contains supporting assets/report-checklist.md"
fi

ran=$((ran + 1))
compat=$(echo "$skill_body" | grep -E '^compatibility:' || true)
if echo "$compat" | grep -qi -- 'Requires bash'; then
  fail=$((fail + 1))
  echo "FAIL packed compatibility requires bash"
  echo "$compat"
elif ! echo "$compat" | grep -qi -- 'Chat'; then
  fail=$((fail + 1))
  echo "FAIL packed compatibility is not Chat-primary"
  echo "$compat"
else
  echo "OK   packed compatibility is Chat instructions-only"
fi

ran=$((ran + 1))
share_guide=$(zip_extract "$ZIP" xai-bug-reporter/references/share-link-guide.md 2>/dev/null || true)
if echo "$share_guide" | grep -q -- 'Always run `scripts/'; then
  fail=$((fail + 1))
  echo "FAIL packed share-link-guide tells hosts to Always run scripts"
elif echo "$share_guide" | grep -qE 'SKILL_DIR|MAY run `bash'; then
  fail=$((fail + 1))
  echo "FAIL packed share-link-guide tells Chat agents to run bash"
else
  echo "OK   packed share-link-guide does not tell Chat agents to run scripts"
fi

ran=$((ran + 1))
packed_refs=$(zip_extract "$ZIP" xai-bug-reporter/references/triage-protocol.md 2>/dev/null || true)
packed_refs+=$(zip_extract "$ZIP" xai-bug-reporter/references/submission-guide.md 2>/dev/null || true)
if echo "$packed_refs" | grep -qE 'SKILL_DIR|MAY run `bash'; then
  fail=$((fail + 1))
  echo "FAIL packed references tell Chat agents to run bash"
else
  echo "OK   packed references do not tell Chat agents to run bash"
fi

echo
if [[ "$fail" -ne 0 ]]; then
  echo "$fail/$ran FAILED"
  exit 1
fi
echo "$ran/$ran passed"
exit 0
