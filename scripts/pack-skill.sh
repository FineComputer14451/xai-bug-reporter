#!/usr/bin/env bash
# Pack a Chat-facing zip (SKILL.md + LICENSE + assets + references; no scripts).
# Usage: bash scripts/pack-skill.sh
# Writes dist/xai-bug-reporter.zip

set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
NAME="xai-bug-reporter"
DIST="$ROOT/dist"
ZIP_PATH="$DIST/${NAME}.zip"

for f in SKILL.md LICENSE assets references; do
  if [[ ! -e "$ROOT/$f" ]]; then
    echo "missing required path: $ROOT/$f" >&2
    exit 1
  fi
done

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

STAGE_DIR="$STAGE/$NAME"
mkdir -p "$STAGE_DIR"
cp "$ROOT/SKILL.md" "$ROOT/LICENSE" "$STAGE_DIR/"
cp -R "$ROOT/assets" "$ROOT/references" "$STAGE_DIR/"
rm -rf "$STAGE_DIR/scripts"

links=$(find "$STAGE_DIR" -type l -print)
if [[ -n "$links" ]]; then
  echo "refusing to pack symlink members (skill hosts reject them):" >&2
  echo "$links" >&2
  exit 1
fi

mkdir -p "$DIST"
rm -f "$ZIP_PATH"

list_zip() {
  if command -v unzip >/dev/null 2>&1; then
    unzip -l "$ZIP_PATH"
  elif command -v python3 >/dev/null 2>&1; then
    python3 - "$ZIP_PATH" <<'PY'
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as zf:
    zf.printdir()
PY
  else
    echo "(no unzip or python3 to list archive)" >&2
  fi
}

(
  cd "$STAGE"
  if command -v zip >/dev/null 2>&1; then
    zip -r -X "$ZIP_PATH" "$NAME"
  elif command -v python3 >/dev/null 2>&1; then
    python3 - "$ZIP_PATH" "$NAME" <<'PY'
import sys
import zipfile
from pathlib import Path

zip_path = Path(sys.argv[1])
root = Path(sys.argv[2])
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for path in sorted(root.rglob("*")):
        if path.is_file():
            zf.write(path, path.as_posix())
PY
  else
    echo "need zip or python3 to pack $ZIP_PATH" >&2
    exit 1
  fi
)

echo "Wrote $ZIP_PATH"
listing=$(list_zip)
echo "$listing"
# Only assert members when we actually listed the archive (unzip or python3).
if [[ -n "$listing" ]]; then
  if echo "$listing" | grep -q -- 'scripts/'; then
    echo "consumer zip must not contain scripts/" >&2
    rm -f "$ZIP_PATH"
    exit 1
  fi
  if ! echo "$listing" | grep -q -- "${NAME}/SKILL.md"; then
    echo "consumer zip missing ${NAME}/SKILL.md" >&2
    rm -f "$ZIP_PATH"
    exit 1
  fi
fi
exit 0
