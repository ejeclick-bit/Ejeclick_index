#!/usr/bin/env bash
set -euo pipefail

# Optimize images in src/assets to WebP and AVIF
# Requires: cwebp, avifenc (from libwebp and libavif)

INPUT_DIR="src/assets"
QUALITY=80

for img in "$INPUT_DIR"/*.{png,jpg,jpeg}; do
  [ -f "$img" ] || continue

  base="${img%.*}"

  # WebP
  if [ ! -f "${base}.webp" ]; then
    echo "→ WebP: ${base}.webp"
    cwebp -q $QUALITY "$img" -o "${base}.webp" 2>/dev/null || true
  fi

  # AVIF
  if [ ! -f "${base}.avif" ]; then
    echo "→ AVIF: ${base}.avif"
    avifenc --min 0 --max 63 -s 8 "$img" "${base}.avif" 2>/dev/null || true
  fi
done

echo "✓ Done"
