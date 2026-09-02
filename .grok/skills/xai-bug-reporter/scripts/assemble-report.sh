#!/usr/bin/env bash
# Assemble a paste-ready report from KEY=VALUE pairs (file or env).
# Usage: bash scripts/assemble-report.sh report.env
#        KEY=VAL ... bash scripts/assemble-report.sh

set -euo pipefail

declare -A F

load_file() {
  local f="$1"
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// /}" ]] && continue
    if [[ "$line" =~ ^([A-Za-z0-9_]+)=(.*)$ ]]; then
      F["${BASH_REMATCH[1]}"]="${BASH_REMATCH[2]}"
    fi
  done < "$f"
}

if [[ -n "${1:-}" && -f "$1" ]]; then
  load_file "$1"
fi

# Also accept already-exported env vars
for k in PRODUCT SURFACE SUBMIT_VIA SEVERITY CATEGORY IMPACT ACCOUNT_EMAIL SUBSCRIPTION_TIER PLATFORM SYSTEM_INFO DESCRIPTION STEPS EXPECTED ACTUAL SHARE_LINK SCREENSHOT API_LOGS INVOICE PURCHASE_CHANNEL WORKAROUND FREQUENCY IN_CHAT OUTAGE_CHECK; do
  if [[ -n "${!k:-}" ]]; then
    F["$k"]="${!k}"
  fi
done

get() { echo "${F[$1]:-}" ; }

cat <<ENDREPORT
-----BEGIN REPORT-----
Status: INCOMPLETE

=== TRIAGE ===
Product: $(get PRODUCT)
Surface: $(get SURFACE)
Submit via: $(get SUBMIT_VIA)
Severity: $(get SEVERITY)
Category: $(get CATEGORY)
Impact: $(get IMPACT)

=== REQUIRED ===
Account email: $(get ACCOUNT_EMAIL)
Subscription tier: $(get SUBSCRIPTION_TIER)
Platform: $(get PLATFORM)
System & app info: $(get SYSTEM_INFO)
Bug description: $(get DESCRIPTION)

Evidence:
  Conversation share link: $(get SHARE_LINK)
  Screenshot: $(get SCREENSHOT)
  API request / response / logs (sanitized): $(get API_LOGS)

=== PREFERRED ===
Steps to reproduce:
$(get STEPS)
Expected vs actual: $(get EXPECTED) / $(get ACTUAL)

=== BILLING (if applicable) ===
Invoice / receipt number: $(get INVOICE)
Purchase channel (Web / App Store / Google Play / X / API): $(get PURCHASE_CHANNEL)

=== NOTES ===
Workaround: $(get WORKAROUND)
Frequency: $(get FREQUENCY)
Reported from inside the chat where the bug occurred: $(get IN_CHAT)
Outage check (status.x.ai): $(get OUTAGE_CHECK)
-----END REPORT-----
ENDREPORT
