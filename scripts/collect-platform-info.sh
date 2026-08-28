#!/usr/bin/env bash
# Collect system / platform / GPU information for bug reports.
# Usage: bash scripts/collect-platform-info.sh [--json]

set -euo pipefail

JSON=0
[[ "${1:-}" == "--json" ]] && JSON=1

os_name=$(uname -s 2>/dev/null || echo "unknown")
os_release=$(uname -r 2>/dev/null || echo "unknown")
arch=$(uname -m 2>/dev/null || echo "unknown")
hostname=$(hostname 2>/dev/null || echo "unknown")
shell_name=${SHELL:-unknown}

pretty="unknown"
if [[ -f /etc/os-release ]]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  pretty="${PRETTY_NAME:-$NAME $VERSION}"
elif command -v sw_vers >/dev/null 2>&1; then
  pretty=$(sw_vers -productName 2>/dev/null)" "$(sw_vers -productVersion 2>/dev/null)
fi

# Browsers on PATH
browsers=()
for b in google-chrome chromium chromium-browser firefox brave-browser microsoft-edge; do
  if command -v "$b" >/dev/null 2>&1; then
    browsers+=("$b")
  fi
done
browser_str=${browsers[*]:-none detected}

# GPU detection
gpu_source="none"
gpu_name="unknown"
gpu_driver=""
gpu_vram=""
gpu_devices=()

if command -v nvidia-smi >/dev/null 2>&1; then
  gpu_source="nvidia-smi"
  gpu_name=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1 | xargs)
  gpu_driver=$(nvidia-smi --query-gpu=driver_version --format=csv,noheader 2>/dev/null | head -1 | xargs)
  gpu_vram=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader 2>/dev/null | head -1 | xargs)
  while IFS= read -r line; do gpu_devices+=("$line"); done < <(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null)
elif command -v lspci >/dev/null 2>&1; then
  gpu_source="lspci"
  while IFS= read -r line; do
    gpu_devices+=("$line")
  done < <(lspci 2>/dev/null | grep -iE 'vga|3d|display' || true)
  gpu_name=${gpu_devices[0]:-unknown}
elif command -v system_profiler >/dev/null 2>&1; then
  gpu_source="system_profiler"
  gpu_name=$(system_profiler SPDisplaysDataType 2>/dev/null | grep -E 'Chipset|Vendor' | head -3 | xargs)
elif command -v glxinfo >/dev/null 2>&1; then
  gpu_source="glxinfo"
  gpu_name=$(glxinfo 2>/dev/null | grep -i "openGL renderer" | head -1 | cut -d: -f2- | xargs)
fi

if [[ $JSON -eq 1 ]]; then
  # Minimal JSON (no jq dependency)
  devices_json="["
  first=1
  for d in "${gpu_devices[@]:-}"; do
    [[ $first -eq 0 ]] && devices_json+=","
    devices_json+="\"${d//\"/\\\"}\""
    first=0
  done
  devices_json+="]"
  cat <<EOF
{
  "os_name": "$os_name",
  "os_release": "$os_release",
  "pretty": "$pretty",
  "arch": "$arch",
  "hostname": "$hostname",
  "shell": "$shell_name",
  "browsers": "$browser_str",
  "gpu": {
    "source": "$gpu_source",
    "name": "$gpu_name",
    "driver": "$gpu_driver",
    "vram": "$gpu_vram",
    "devices": $devices_json
  }
}
EOF
  exit 0
fi

cat <<EOF
=== PLATFORM / SYSTEM INFO ===
OS:              $pretty ($os_name $os_release)
Architecture:    $arch
Hostname:        $hostname
Shell:           $shell_name
Browsers (PATH): $browser_str

=== GPU ===
Source:          $gpu_source
Name:            $gpu_name
Driver:          ${gpu_driver:-n/a}
VRAM:            ${gpu_vram:-n/a}

Checklist lines (copy into report):
Platform:        [Web / iOS / Android — confirm with user]
System & app:    $pretty / $os_release / $arch
GPU:             $gpu_name ($gpu_source)
Note: Exact Grok app version or browser version + extensions must still be confirmed with the user.
EOF
