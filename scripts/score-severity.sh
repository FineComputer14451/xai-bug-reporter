#!/usr/bin/env bash
# Suggest triage severity from a free-text problem description.
# Usage: bash scripts/score-severity.sh "description"
#        echo "description" | bash scripts/score-severity.sh

set -euo pipefail

DESC="${1:-}"
if [[ -z "$DESC" && ! -t 0 ]]; then
  DESC=$(cat)
fi
DESC=$(echo "$DESC" | tr '[:upper:]' '[:lower:]')

if [[ -z "$DESC" ]]; then
  echo "Usage: $0 \"problem description\""
  exit 1
fi

score_critical=0
score_high=0
score_medium=0
score_low=0

# Critical signals
[[ "$DESC" =~ (data.?loss|lost all|deleted everything|security|leak|exposed|ransomware|cannot log|locked out permanently) ]] && score_critical=$((score_critical+3))
[[ "$DESC" =~ (complete(ly)? (down|broken|unusable)|total (failure|outage)|cannot use at all) ]] && score_critical=$((score_critical+2))

# High signals
[[ "$DESC" =~ (crash|freezes?|hangs?|force.?close|segfault|panic) ]] && score_high=$((score_high+2))
[[ "$DESC" =~ (no workaround|cannot work around|blocked|billing.*(wrong|charged|double)|subscription.*(fail|error)) ]] && score_high=$((score_high+2))
[[ "$DESC" =~ (major feature|core (feature|function)|completely fail) ]] && score_high=$((score_high+1))

# Medium signals
[[ "$DESC" =~ (slow|latency|lag|timeout|intermittent|sometimes|degraded|workaround) ]] && score_medium=$((score_medium+2))
[[ "$DESC" =~ (error|bug|broken|fail|issue|problem) ]] && score_medium=$((score_medium+1))

# Low signals
[[ "$DESC" =~ (cosmetic|visual|alignment|typo|minor|annoy|ui (glitch|polish)|nice.?to.?have) ]] && score_low=$((score_low+3))
[[ "$DESC" =~ (suggestion|improvement|feature request) ]] && score_low=$((score_low+2))

# Pick winner
max=$score_medium
suggested="Medium"
[[ $score_low -gt $max ]] && { max=$score_low; suggested="Low"; }
[[ $score_high -gt $max ]] && { max=$score_high; suggested="High"; }
[[ $score_critical -gt $max ]] && { max=$score_critical; suggested="Critical"; }

# Weak signal → default Medium
if [[ $max -eq 0 ]]; then
  suggested="Medium"
fi

cat <<EOF
Suggested severity: $suggested
Rationale scores — Critical:$score_critical High:$score_high Medium:$score_medium Low:$score_low
IMPORTANT: This is only a suggestion. Confirm with the user before locking Severity in the triage block.
EOF
