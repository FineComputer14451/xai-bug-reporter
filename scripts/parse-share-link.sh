#!/usr/bin/env bash
# Parse Grok / xAI conversation share links.
# Usage: bash scripts/parse-share-link.sh <url>
#        bash scripts/parse-share-link.sh --json <url>

set -euo pipefail

JSON=0
URL=""
if [[ "${1:-}" == "--json" ]]; then
  JSON=1
  URL="${2:-}"
else
  URL="${1:-}"
fi

if [[ -z "$URL" ]]; then
  echo "Usage: $0 [--json] <share-url>"
  exit 1
fi

# Normalize
URL=$(echo "$URL" | xargs)

host=""
path=""
share_id=""
link_type="unknown"

if [[ "$URL" =~ ^https?://([^/]+)(/.*)?$ ]]; then
  host="${BASH_REMATCH[1]}"
  path="${BASH_REMATCH[2]:-/}"
else
  echo "ERROR: not a valid URL"
  exit 1
fi

host_lc=$(echo "$host" | tr '[:upper:]' '[:lower:]')

case "$host_lc" in
  grok.com|www.grok.com|grok.x.ai|grok.x.com)
    link_type="grok_web"
    if [[ "$path" =~ /share/([A-Za-z0-9_-]+) ]]; then
      share_id="${BASH_REMATCH[1]}"
    fi
    ;;
  x.com|www.x.com|twitter.com)
    link_type="x_grok"
    if [[ "$path" =~ /i/grok/share/([A-Za-z0-9_-]+) ]] || [[ "$path" =~ /share/([A-Za-z0-9_-]+) ]]; then
      share_id="${BASH_REMATCH[1]}"
    fi
    ;;
  *)
    echo "WARNING: host '$host' is not a known Grok/xAI share host"
    if [[ $JSON -eq 1 ]]; then
      echo "{\"ok\":false,\"error\":\"unknown_host\",\"host\":\"$host\",\"url\":\"$URL\"}"
    fi
    exit 1
    ;;
esac

if [[ -z "$share_id" ]]; then
  if [[ $JSON -eq 1 ]]; then
    echo "{\"ok\":false,\"error\":\"missing_share_id\",\"host\":\"$host\",\"path\":\"$path\",\"url\":\"$URL\"}"
  else
    echo "ERROR: share id not found in $URL"
  fi
  exit 1
fi

if [[ $JSON -eq 1 ]]; then
  cat <<EOF
{
  "ok": true,
  "url": "$URL",
  "host": "$host",
  "path": "$path",
  "share_id": "$share_id",
  "link_type": "$link_type"
}
EOF
  exit 0
fi

cat <<EOF
Share link parsed
URL:        $URL
Host:       $host
Path:       $path
Share ID:   ${share_id:-not found}
Link type:  $link_type

Checklist lines:
Conversation share link: $URL
Share ID: ${share_id:-}
EOF
