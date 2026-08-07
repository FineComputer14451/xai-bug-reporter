#!/usr/bin/env bash
# Validate a bug report for required fields (including triage).
# Usage: bash scripts/validate-report.sh [file]
#        cat report.txt | bash scripts/validate-report.sh

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

check() {
  local field="$1" pattern="$2"
  if ! echo "$CONTENT" | grep -qiE "$pattern"; then
    missing+=("$field")
  fi
}

check_pref() {
  local field="$1" pattern="$2"
  if ! echo "$CONTENT" | grep -qiE "$pattern"; then
    preferred_missing+=("$field")
  fi
}

# Required
check "Severity" 'severity[[:space:]]*:'
check "Category" 'categor(y|ies)[[:space:]]*:'
check "Impact" 'impact[[:space:]]*:'
check "Account email" '(account[[:space:]]*)?email[[:space:]]*:|[[:alnum:]._%+-]+@[[:alnum:].-]+\.[[:alpha:]]{2,}'
check "Subscription tier" 'subscription[[:space:]]*tier[[:space:]]*:|(super)?grok(pro)?|free[[:space:]]*tier'
check "Platform" 'platform[[:space:]]*:|(web|ios|android)'
check "System/app info" 'system|os[[:space:]]*version|device|app[[:space:]]*version|browser'
check "Bug description" 'description|bug[[:space:]]*:|issue[[:space:]]*:'

# Preferred
check_pref "Steps to reproduce" 'steps[[:space:]]*to[[:space:]]*reproduce|reproduction'
check_pref "Share link or screenshot" 'share[[:space:]]*link|screenshot|https?://(grok\.com|x\.com)/'

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
