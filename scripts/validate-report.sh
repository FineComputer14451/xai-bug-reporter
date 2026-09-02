#!/usr/bin/env bash
# Validate a bug report for required fields (including triage).
# Usage: bash scripts/validate-report.sh [file]
#        cat report.txt | bash scripts/validate-report.sh
#
# Labels with empty or whitespace-only values do not count as present.

set -euo pipefail

CONTENT=""
if [[ -n "${1:-}" && -f "$1" ]]; then
  CONTENT=$(cat "$1")
elif [[ ! -t 0 ]]; then
  CONTENT=$(cat)
else
  echo "Usage: $0 [report-file]   or pipe content"
  exit 1
fi

missing=()
preferred_missing=()

trim() {
  local s="$1"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
}

# Text after the first colon on the first matching label line.
line_value() {
  local re="$1"
  local line val
  line=$(printf '%s\n' "$CONTENT" | grep -iE "^[[:space:]]*${re}[[:space:]]*:" | head -1) || true
  if [[ -z "$line" ]]; then
    printf ''
    return 0
  fi
  val="${line#*:}"
  trim "$val"
}

check_nonempty() {
  local field="$1"
  local re="$2"
  local val
  val=$(line_value "$re")
  if [[ -z "$val" ]]; then
    missing+=("$field")
  fi
}

check_email() {
  local val
  val=$(line_value '(account[[:space:]]+)?email')
  if [[ ! "$val" =~ ^[[:alnum:]._%+-]+@[[:alnum:].-]+\.[[:alpha:]]{2,}$ ]]; then
    missing+=("Account email")
  fi
}

steps_value() {
  local grab=0
  local buf=""
  local line rest
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" =~ ^[[:space:]]*[Ss]teps[[:space:]]+to[[:space:]]+reproduce:[[:space:]]*(.*)$ ]]; then
      rest=$(trim "${BASH_REMATCH[1]}")
      buf="$rest"
      grab=1
      continue
    fi
    if [[ $grab -eq 1 ]]; then
      if [[ "$line" =~ ^[[:space:]]*([Ee]vidence:|[Ee]xpected[[:space:]]+vs|[Ee][Qq][Uu][Aa][Ll]{2}[[:space:]]|[-=]{3}) ]]; then
        break
      fi
      buf+=$'\n'"$line"
    fi
  done <<< "$CONTENT"
  trim "$buf"
}

is_share_evidence() {
  local url="$1"
  [[ "$url" =~ https?://[^[:space:]]+/((i/grok/)?share/)[A-Za-z0-9_-]+ ]]
}

is_screenshot_evidence() {
  local shot="$1"
  local shot_lc
  shot_lc=$(printf '%s' "$shot" | tr '[:upper:]' '[:lower:]')
  case "$shot_lc" in
    ''|no|n|none|false|0) return 1 ;;
    *) return 0 ;;
  esac
}

# Required — values, not bare labels
check_nonempty "Severity" 'severity'
check_nonempty "Category" 'categor(y|ies)'
check_nonempty "Impact" 'impact'
check_email
check_nonempty "Subscription tier" 'subscription[[:space:]]+tier'
check_nonempty "Platform" 'platform'
check_nonempty "System/app info" 'system[[:space:]]*&[[:space:]]*app[[:space:]]*info'
check_nonempty "Bug description" 'bug[[:space:]]+description'

# Preferred
if [[ -z "$(steps_value)" ]]; then
  preferred_missing+=("Steps to reproduce")
fi

# Required evidence: nonempty share id URL or a real screenshot (not no/none/false)
share_val=$(line_value '(conversation[[:space:]]+share[[:space:]]+link|share[[:space:]]+link)')
shot_val=$(line_value 'screenshot')
if ! is_share_evidence "$share_val" && ! is_screenshot_evidence "$shot_val"; then
  missing+=("Share link or screenshot")
fi

echo "=== Report validation ==="
if [[ ${#missing[@]} -eq 0 ]]; then
  echo "REQUIRED: all present"
else
  echo "REQUIRED missing:"
  for m in "${missing[@]}"; do echo "  - $m"; done
fi

if [[ ${#preferred_missing[@]} -eq 0 ]]; then
  echo "PREFERRED: all present"
else
  echo "PREFERRED missing (still usable):"
  for m in "${preferred_missing[@]}"; do echo "  - $m"; done
fi

if [[ ${#missing[@]} -eq 0 ]]; then
  echo "STATUS: READY TO SUBMIT"
  exit 0
else
  echo "STATUS: INCOMPLETE — collect missing required fields before submission"
  exit 1
fi
