#!/usr/bin/env bash
# Validate a Grok share link (structure + optional live HTTP).
# Usage: bash scripts/validate-share-link.sh [--json] [--offline] <url>

set -euo pipefail

JSON=0
OFFLINE=0
URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json) JSON=1; shift ;;
    --offline) OFFLINE=1; shift ;;
    *) URL="$1"; shift ;;
  esac
done

if [[ -z "$URL" ]]; then
  echo "Usage: $0 [--json] [--offline] <url>"
  exit 1
fi

# Re-use parser logic (inline for self-containment)
host=""
share_id=""
link_type="unknown"
structural_ok=0
path=""

if [[ "$URL" =~ ^https?://([^/]+)(/.*)?$ ]]; then
  host="${BASH_REMATCH[1]}"
  path="${BASH_REMATCH[2]:-/}"
else
  result="fail_structural"
  reason="not a valid URL"
  structural_ok=0
fi

host_lc=$(echo "${host:-}" | tr '[:upper:]' '[:lower:]')
case "$host_lc" in
  grok.com|www.grok.com|grok.x.ai|grok.x.com)
    link_type="grok_web"
    [[ "$path" =~ /share/([A-Za-z0-9_-]+) ]] && share_id="${BASH_REMATCH[1]}"
    structural_ok=1
    ;;
  x.com|www.x.com|twitter.com)
    link_type="x_grok"
    if [[ "$path" =~ /i/grok/share/([A-Za-z0-9_-]+) ]] || [[ "$path" =~ /share/([A-Za-z0-9_-]+) ]]; then
      share_id="${BASH_REMATCH[1]}"
    fi
    structural_ok=1
    ;;
  *)
    result="fail_structural"
    reason="unknown host: $host"
    structural_ok=0
    ;;
esac

if [[ $structural_ok -eq 0 ]]; then
  if [[ $JSON -eq 1 ]]; then
    echo "{\"result\":\"${result:-fail_structural}\",\"reason\":\"${reason:-invalid}\",\"url\":\"$URL\"}"
  else
    echo "Result: ${result:-fail_structural} (${reason:-invalid})"
  fi
  exit 1
fi

if [[ $OFFLINE -eq 1 ]]; then
  result="pass_structural_only"
  reason="offline mode — structure OK, share_id=${share_id:-none}"
  if [[ $JSON -eq 1 ]]; then
    echo "{\"result\":\"$result\",\"reason\":\"$reason\",\"url\":\"$URL\",\"share_id\":\"$share_id\",\"link_type\":\"$link_type\"}"
  else
    echo "Result: $result"
    echo "$reason"
  fi
  exit 0
fi

# Live check
http_code="000"
body_file=$(mktemp)
trap 'rm -f "$body_file"' EXIT

set +e
http_code=$(curl -sS -L --max-time 15 -o "$body_file" -w "%{http_code}" "$URL" 2>/dev/null)
curl_rc=$?
set -e

if [[ $curl_rc -ne 0 ]]; then
  result="fail_network"
  reason="curl failed (rc=$curl_rc)"
elif [[ "$http_code" != "200" && "$http_code" != "301" && "$http_code" != "302" ]]; then
  result="fail_http_${http_code}"
  reason="HTTP $http_code"
else
  body=$(head -c 20000 "$body_file" 2>/dev/null || true)
  body_lc=$(echo "$body" | tr '[:upper:]' '[:lower:]')
  if echo "$body_lc" | grep -qE 'expired|not found|private|login|sign in|access denied|does not exist'; then
    result="fail_expired_or_private"
    reason="page indicates expired/private/gated"
  elif echo "$body_lc" | grep -qE 'share|conversation|grok|message'; then
    result="pass"
    reason="HTTP $http_code + share-like content"
  else
    result="pass_uncertain_content"
    reason="HTTP $http_code but content heuristics inconclusive — still use URL + request screenshot"
  fi
fi

if [[ $JSON -eq 1 ]]; then
  echo "{\"result\":\"$result\",\"reason\":\"$reason\",\"url\":\"$URL\",\"share_id\":\"$share_id\",\"link_type\":\"$link_type\",\"http_code\":\"$http_code\"}"
else
  echo "Result: $result"
  echo "Reason: $reason"
  echo "Share ID: ${share_id:-}"
  echo "Link type: $link_type"
  echo "HTTP: $http_code"
fi

case "$result" in
  pass|pass_uncertain_content|pass_structural_only) exit 0 ;;
  *) exit 1 ;;
esac
